"use client";

import { calculatePosition, parsePathToVertices } from "@/lib/utils";
import lodash from "lodash";
import Matter from "matter-js";
import {
  type ReactNode,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

type GravityProps = {
  children: ReactNode;
  debug?: boolean;
  gravity?: { x: number; y: number };
  resetOnResize?: boolean;
  grabCursor?: boolean;
  addTopWall?: boolean;
  autoStart?: boolean;
  className?: string;
  padding?: number | { x: number; y: number }; // Add this line
};

type PhysicsBody = {
  element: HTMLElement;
  body: Matter.Body;
  props: MatterBodyProps;
};

type MatterBodyProps = {
  children: ReactNode;
  matterBodyOptions?: Matter.IBodyDefinition;
  isDraggable?: boolean;
  bodyType?: "rectangle" | "circle" | "svg";
  sampleLength?: number;
  x?: number | string;
  y?: number | string;
  angle?: number;
  className?: string;
};

export type GravityRef = {
  start: () => void;
  stop: () => void;
  reset: () => void;
};

const GravityContext = createContext<{
  registerElement: (
    id: string,
    element: HTMLElement,
    props: MatterBodyProps
  ) => void;
  unregisterElement: (id: string) => void;
} | null>(null);

export const MatterBody = ({
  children,
  className,
  matterBodyOptions = {
    friction: 0.1,
    restitution: 0.1,
    density: 0.001,
    isStatic: false,
  },
  bodyType = "rectangle",
  isDraggable = true,
  sampleLength = 15,
  x = 0,
  y = 0,
  angle = 0,
  ...props
}: MatterBodyProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(Math.random().toString(36).substring(7));
  const context = useContext(GravityContext);

  useEffect(() => {
    if (!elementRef.current || !context) return;
    context.registerElement(idRef.current, elementRef.current, {
      children,
      matterBodyOptions,
      bodyType,
      sampleLength,
      isDraggable,
      x,
      y,
      angle,
      ...props,
    });

    return () => context.unregisterElement(idRef.current);
  }, [props, children, matterBodyOptions, isDraggable]);

  return (
    <div
      ref={elementRef}
      className={cn(
        "absolute",
        className,
        isDraggable && "pointer-events-none"
      )}
    >
      {children}
    </div>
  );
};

const Gravity = forwardRef<GravityRef, GravityProps>(
  (
    {
      children,
      debug = false,
      gravity = { x: 0, y: 1 },
      grabCursor = true,
      resetOnResize = true,
      addTopWall = true,
      autoStart = true,
      className,
      padding = 0, // Add this line
      ...props
    },
    ref
  ) => {
    const canvas = useRef<HTMLDivElement>(null);
    const engine = useRef(Matter.Engine.create());
    const render = useRef<Matter.Render>();
    const runner = useRef<Matter.Runner>();
    const bodiesMap = useRef(new Map<string, PhysicsBody>());
    const frameId = useRef<number>();
    const mouseConstraint = useRef<Matter.MouseConstraint>();
    const mouseDown = useRef(false);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const isRunning = useRef(false);

    const getPadding = useCallback(() => {
      if (typeof padding === "number") {
        return { x: padding, y: padding };
      }
      return padding;
    }, [padding]);

    // Register Matter.js body in the physics world
    const registerElement = useCallback(
      (id: string, element: HTMLElement, props: MatterBodyProps) => {
        if (!canvas.current) return;
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        const canvasRect = canvas.current!.getBoundingClientRect();
        const { x: paddingX, y: paddingY } = getPadding();

        const angle = (props.angle || 0) * (Math.PI / 180);

        const x =
          calculatePosition(props.x, canvasRect.width - paddingX * 2, width) +
          paddingX;
        const y =
          calculatePosition(props.y, canvasRect.height - paddingY * 2, height) +
          paddingY;

        let body: Matter.Body | null = null;
        if (props.bodyType === "circle") {
          const radius = Math.max(width, height) / 2;
          body = Matter.Bodies.circle(x, y, radius, {
            ...props.matterBodyOptions,
            angle: angle,
            render: {
              fillStyle: debug ? "#888888" : "#00000000",
              strokeStyle: debug ? "#333333" : "#00000000",
              lineWidth: debug ? 3 : 0,
            },
          });
        } else if (props.bodyType === "svg") {
          const paths = element.querySelectorAll("path");
          const vertexSets: Matter.Vector[][] = [];

          paths.forEach((path) => {
            const d = path.getAttribute("d");
            const p = parsePathToVertices(d!, props.sampleLength);
            vertexSets.push(p);
          });

          body = Matter.Bodies.fromVertices(x, y, vertexSets, {
            ...props.matterBodyOptions,
            angle: angle,
            render: {
              fillStyle: debug ? "#888888" : "#00000000",
              strokeStyle: debug ? "#333333" : "#00000000",
              lineWidth: debug ? 3 : 0,
            },
          });
        } else {
          body = Matter.Bodies.rectangle(x, y, width, height, {
            ...props.matterBodyOptions,
            angle: angle,
            render: {
              fillStyle: debug ? "#888888" : "#00000000",
              strokeStyle: debug ? "#333333" : "#00000000",
              lineWidth: debug ? 3 : 0,
            },
          });
        }

        if (body) {
          Matter.World.add(engine.current.world, [body]);
          bodiesMap.current.set(id, { element, body, props });
        }
      },
      [debug, getPadding]
    );

    // Unregister Matter.js body from the physics world
    const unregisterElement = useCallback((id: string) => {
      const body = bodiesMap.current.get(id);
      if (body) {
        Matter.World.remove(engine.current.world, body.body);
        bodiesMap.current.delete(id);
      }
    }, []);

    // Keep react elements in sync with the physics world
    const updateElements = useCallback(() => {
      bodiesMap.current.forEach(({ element, body }) => {
        const { x, y } = body.position;
        const rotation = body.angle * (180 / Math.PI);

        element.style.transform = `translate(${
          x - element.offsetWidth / 2
        }px, ${y - element.offsetHeight / 2}px) rotate(${rotation}deg)`;
      });

      frameId.current = requestAnimationFrame(updateElements);
    }, []);

    const initializeRenderer = useCallback(() => {
      if (!canvas.current) return;

      const height = canvas.current.offsetHeight;
      const width = canvas.current.offsetWidth;
      const { x: paddingX, y: paddingY } = getPadding();

      Matter.Common.setDecomp(require("poly-decomp"));

      engine.current.gravity.x = gravity.x;
      engine.current.gravity.y = gravity.y;

      render.current = Matter.Render.create({
        element: canvas.current,
        engine: engine.current,
        options: {
          width,
          height,
          wireframes: false,
          background: "#00000000",
        },
      });

      const mouse = Matter.Mouse.create(render.current.canvas);
      mouseConstraint.current = Matter.MouseConstraint.create(engine.current, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: debug,
          },
        },
      });

      // Add walls
      const walls = [
        // Floor
        Matter.Bodies.rectangle(
          width / 2,
          height - paddingY,
          width - paddingX * 2,
          20,
          {
            isStatic: true,
            friction: 1,
            render: { visible: debug },
          }
        ),
        // Right wall
        Matter.Bodies.rectangle(
          width - paddingX,
          height / 2,
          20,
          height - paddingY * 2,
          {
            isStatic: true,
            friction: 1,
            render: { visible: debug },
          }
        ),
        // Left wall
        Matter.Bodies.rectangle(
          paddingX,
          height / 2,
          20,
          height - paddingY * 2,
          {
            isStatic: true,
            friction: 1,
            render: { visible: debug },
          }
        ),
      ];

      const topWall = addTopWall
        ? Matter.Bodies.rectangle(
            width / 2,
            paddingY,
            width - paddingX * 2,
            20,
            {
              isStatic: true,
              friction: 1,
              render: { visible: debug },
            }
          )
        : null;

      if (topWall) {
        walls.push(topWall);
      }

      const touchingMouse = () =>
        Matter.Query.point(
          engine.current.world.bodies,
          mouseConstraint.current?.mouse.position || { x: 0, y: 0 }
        ).length > 0;

      if (grabCursor) {
        Matter.Events.on(engine.current, "beforeUpdate", (event) => {
          if (canvas.current) {
            if (!mouseDown.current && !touchingMouse()) {
              canvas.current.style.cursor = "default";
            } else if (touchingMouse()) {
              canvas.current.style.cursor = mouseDown.current
                ? "grabbing"
                : "grab";
            }
          }
        });

        canvas.current.addEventListener("mousedown", (event) => {
          mouseDown.current = true;

          if (canvas.current) {
            if (touchingMouse()) {
              canvas.current.style.cursor = "grabbing";
            } else {
              canvas.current.style.cursor = "default";
            }
          }
        });
        canvas.current.addEventListener("mouseup", (event) => {
          mouseDown.current = false;

          if (canvas.current) {
            if (touchingMouse()) {
              canvas.current.style.cursor = "grab";
            } else {
              canvas.current.style.cursor = "default";
            }
          }
        });
      }

      Matter.World.add(engine.current.world, [
        mouseConstraint.current,
        ...walls,
      ]);

      render.current.mouse = mouse;

      runner.current = Matter.Runner.create();
      Matter.Render.run(render.current);
      updateElements();
      runner.current.enabled = false;

      if (autoStart) {
        runner.current.enabled = true;
        startEngine();
      }
    }, [updateElements, debug, autoStart, getPadding]);

    // Clear the Matter.js world
    const clearRenderer = useCallback(() => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }

      if (mouseConstraint.current) {
        Matter.World.remove(engine.current.world, mouseConstraint.current);
      }

      if (render.current) {
        Matter.Mouse.clearSourceEvents(render.current.mouse);
        Matter.Render.stop(render.current);
        render.current.canvas.remove();
      }

      if (runner.current) {
        Matter.Runner.stop(runner.current);
      }

      if (engine.current) {
        Matter.World.clear(engine.current.world, false);
        Matter.Engine.clear(engine.current);
      }

      bodiesMap.current.clear();
    }, []);

    const handleResize = useCallback(() => {
      if (!canvas.current || !resetOnResize) return;

      const newWidth = canvas.current.offsetWidth;
      const newHeight = canvas.current.offsetHeight;

      setCanvasSize({ width: newWidth, height: newHeight });

      // Clear and reinitialize
      clearRenderer();
      initializeRenderer();
    }, [clearRenderer, initializeRenderer, resetOnResize]);

    const startEngine = useCallback(() => {
      if (runner.current) {
        runner.current.enabled = true;

        Matter.Runner.run(runner.current, engine.current);
      }
      if (render.current) {
        Matter.Render.run(render.current);
      }
      frameId.current = requestAnimationFrame(updateElements);
      isRunning.current = true;
    }, [updateElements, canvasSize]);

    const stopEngine = useCallback(() => {
      if (!isRunning.current) return;

      if (runner.current) {
        Matter.Runner.stop(runner.current);
      }
      if (render.current) {
        Matter.Render.stop(render.current);
      }
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
      isRunning.current = false;
    }, []);

    const reset = useCallback(() => {
      stopEngine();
      bodiesMap.current.forEach(({ element, body, props }) => {
        body.angle = props.angle || 0;

        const x = calculatePosition(
          props.x,
          canvasSize.width,
          element.offsetWidth
        );
        const y = calculatePosition(
          props.y,
          canvasSize.height,
          element.offsetHeight
        );
        body.position.x = x;
        body.position.y = y;
      });
      updateElements();
      handleResize();
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        start: startEngine,
        stop: stopEngine,
        reset,
      }),
      [startEngine, stopEngine]
    );

    useEffect(() => {
      if (!resetOnResize) return;

      const debouncedResize = lodash.debounce(handleResize, 500);
      window.addEventListener("resize", debouncedResize);

      return () => {
        window.removeEventListener("resize", debouncedResize);
        debouncedResize.cancel();
      };
    }, [handleResize, resetOnResize]);

    useEffect(() => {
      initializeRenderer();
      return clearRenderer;
    }, [initializeRenderer, clearRenderer]);

    return (
      <GravityContext.Provider value={{ registerElement, unregisterElement }}>
        <div
          ref={canvas}
          className={cn(className, "absolute top-0 left-0 w-full h-full")}
          {...props}
        >
          {children}
        </div>
      </GravityContext.Provider>
    );
  }
);

Gravity.displayName = "Gravity";
export default Gravity;
