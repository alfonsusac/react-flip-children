"use client"

import { Fragment, memo, PureComponent, useEffect, useLayoutEffect, useRef, useState, type ChangeEvent, type ComponentProps, type MouseEvent, type SVGProps } from "react"
import { AnimateChild } from "../ui/Reorder2"
import { cn } from "lazy-cn"
import { ReorderArray } from "../ui/Reorder"
import { useSearchParams } from "next/navigation"
import { ViewTransition } from "../ui/ViewTransition"
import Link from "next/link"
import { Flipped, Flipper } from "react-flip-toolkit"
import { AutoAnimate } from "../ui/AutoAnimate"
import { AnimatePresence, MagicMotion } from "react-magic-motion"
import { AnimateChild2 } from "../ui/Reorder3"
import { AnimateChildren } from "../../../lib/AnimateChildren/src"
import { motion } from "motion/react"
import { FlipProvider, useFlip } from "react-easy-flip"
import { getReactEasyFlipEasing } from "./react-easy-flip"


export function ClientTestPage() {

  const {
    change,
    changeWithNumber,
    changeWithText,
    match,
    settings,
  } = useSettings()
  const isUsingViewTransition = settings.reorderer === "viewtransition"

  const {
    array,
    shuffle,
    reverse,
    add,
    addOrRemove3,
    remove,
    moveUp,
    moveDown,
    deleteHalfRandomly,
    deleteOneRandomly,
  } = useControls(settings.initialLength, isUsingViewTransition)



  const childrenProps = [...array, "static"].map((item, index) => {
    return {
      key: item,
      style: {
        zIndex: item === "static" ? 9999 : item,
        backgroundColor: settings.color ? `hsl(${ index * 3 }, 70%, 80%)` : undefined,
      },
      onClick: (typeof item === "number" && !settings.control) ? () => remove(item) : undefined,
      children: <>
        {
          typeof item === "number" && settings.control && (
            <div className="absolute top-1 right-1 left-1 flex opacity-0 transition-all group-hover:data-[visible]:opacity-100" data-visible={settings.control ? "" : undefined}>
              <div onClick={() => remove(item)} className="rounded-sm text-slate-300 hover:text-slate-600 text-xl"><MaterialSymbolsCloseRounded /></div>
              <div className="grow" />
              <div onClick={() => moveUp(item)} className="rounded-sm text-slate-300 hover:text-slate-600 text-xl"><MaterialSymbolsArrowBack2Rounded className={settings.flexDir === "column" ? "rotate-90" : ""} /></div>
              <div onClick={() => moveDown(item)} className="rounded-sm text-slate-300 hover:text-slate-600 text-xl rotate-180"><MaterialSymbolsArrowBack2Rounded className={settings.flexDir === "column" ? "rotate-90" : ""} /></div>
            </div>
          )
        }
        <span className={settings.text ? "transition-all" : "opacity-0 select-none transition-all"}>
        {item}
        </span>
      </>,
    } satisfies ComponentProps<"div"> & { key: string | number }
  })

  const firstFive = childrenProps.slice(0, 5)
  const restOfFive = childrenProps.slice(5)

  const parentProps = {
    style: {
      gap: `${ settings.gap }px`,
      flexDirection: settings.flexDir,
      justifyContent: settings.justify,
      "--width": `${ settings.width }rem`,
      "--height": `${ settings.height }rem`,
    },
    className: cn(
      `p-4 flex flex-wrap gap-2 transition-all `,
      // {
      //   "overflow-x-auto": settings.flexDir === "column",
      // },
      {
        "bg-slate-100": settings.background,
        "shadow-sm": settings.background,

        "overflow-hidden": settings.overflow === "hidden",
        "overflow-visible": settings.overflow === "visible",

        "*:bg-white": settings.elBackground,
        "*:border": settings.border,
        "*:grow": settings.grow,
        "*:drop-shadow-lg": settings.dropShadow,
        "*:animate-none": settings.animation === "none",
        "*:animate-appear": settings.animation === "appear",
        "*:animate-bounce": settings.animation === "bounce",
        "data-[deleting]:*:bg-red-500": settings.entryExitAnimation === "color",
        "data-[deleting]:*:opacity-0": settings.entryExitAnimation === "opacity",
        "data-[deleting]:*:scale-0": settings.entryExitAnimation === "scale",

        "data-[adding]:*:duration-0": true,
        "data-[adding]:*:bg-green-500": settings.entryExitAnimation === "color",
        "data-[adding]:*:opacity-0": settings.entryExitAnimation === "opacity",
        "data-[adding]:*:scale-0": settings.entryExitAnimation === "scale",
        "*:rounded-md": settings.rounded,
        "h-full": settings.flexDir === "column",
        "w-max": settings.flexDir === "column",
      },
    ),
  } as ComponentProps<"div">

  const [invalidEasing, setInvalidEasing] = useState(false)
  const easing = invalidEasing ? "ease-in-out" : settings.easing

  useEffect(() => {
    try {
      const node = document.createElement("div")
      node.animate([], { duration: 1, easing: settings.easing })
      setInvalidEasing(false)
    } catch (error) {
      setInvalidEasing(true)
    }
  }, [settings.easing])

  useFlip("flip-root", {
    duration: settings.duration,
    easing: getReactEasyFlipEasing(settings.easing),
  })

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-200 -mx-8 -my-8">

      <div className="p-4 pb-4 border-b bg-white shadow-sm flex flex-col gap-2">
        <div className="text-slate-500 text-[0.7em] uppercase font-bold">
          Array Reorder Animation Playground by{" "}
          <a
            href="https://x.com/alfonsusac"
            target="_blank"
            className="opacity-60 hover:opacity-100"
          >
            @alfonsusac
          </a>{" "}·{" "}
          <Link href="/" className="opacity-60 hover:opacity-100">
            home
          </Link>{" "}·{" "}
          <Link href="/playground" className="opacity-60 hover:opacity-100">
            Reset
          </Link>
        </div>

        <SettingGroup label="Container">
          <div className="flex items-center gap-2 flex-wrap">
            <InputGroup>
              <Label>Initial Length</Label>
              <input type="number" step={1} value={settings.initialLength ?? ""} onChange={changeWithNumber("initialLength")} />
            </InputGroup>
            <ButtonGroup>
              <Button data-selected={match("overflow", "visible")} onClick={change("overflow")("visible")}>Visible</Button>
              <Button data-selected={match("overflow", "hidden")} onClick={change("overflow")("hidden")}>Hidden</Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button data-selected={match("flexDir", "row")} onClick={change("flexDir")("row")}>Row</Button>
              <Button data-selected={match("flexDir", "column")} onClick={change("flexDir")("column")}>Column</Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button data-selected={match("justify", "start")} onClick={change("justify")("start")}>Start</Button>
              <Button data-selected={match("justify", "center")} onClick={change("justify")("center")}>Center</Button>
              <Button data-selected={match("justify", "end")} onClick={change("justify")("end")}>End</Button>
              <Button data-selected={match("justify", "stretch")} onClick={change("justify")("stretch")}>Stretch</Button>
            </ButtonGroup>
            <InputGroup>
              <Label>Gap</Label>
              <input type="number" min={0} step={1} value={settings.gap ?? ""} onChange={changeWithNumber("gap")} />
              <label>px</label>
            </InputGroup>
            <ButtonGroup>
              <Button data-selected={match("separator", false)} onClick={() => {
                change("separator")(false)()
                change("normalizeKeys")(false)()
              }}>None</Button>
              <Button data-selected={match("separator", true)} onClick={() => {
                change("separator")(true)()
                change("normalizeKeys")(true)()
              }}>With Separator</Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button data-selected={settings.background} onClick={change("background")(!settings.background)}>Background</Button>
            </ButtonGroup>
          </div>
        </SettingGroup>

        <SettingGroup label="Animator">
          <div className="flex gap-2 flex-wrap">
            <ButtonGroup>
              <Button data-selected={match("reorderer", "4")} onClick={change("reorderer")("4")}>React FlIP Children</Button>
              <Button data-selected={match("reorderer", "framer")} onClick={change("reorderer")("framer")}>Motion</Button>
              <Button data-selected={match("reorderer", "react-easy-flip")} onClick={change("reorderer")("react-easy-flip")}>react-easy-flip</Button>
              <Button data-selected={match("reorderer", "3")} onClick={change("reorderer")("3")}>V0.3</Button>
              <Button data-selected={match("reorderer", "2")} onClick={change("reorderer")("2")}>V0.2</Button>
              <Button data-selected={match("reorderer", "1")} onClick={change("reorderer")("1")}>V0.1</Button>
              <Button data-selected={match("reorderer", "viewtransition")} onClick={change("reorderer")("viewtransition")}>ViewTransition</Button>
              <Button data-selected={match("reorderer", "react-flip-toolkit")} onClick={change("reorderer")("react-flip-toolkit")}>react-flip-toolkit</Button>
              <Button data-selected={match("reorderer", "auto-animate")} onClick={change("reorderer")("auto-animate")}>@formkit/auto-animate</Button>
              <Button data-selected={match("reorderer", "react-magic-motion")} onClick={change("reorderer")("react-magic-motion")}>react-magic-motion</Button>
              <Button data-selected={match("reorderer", "none")} onClick={change("reorderer")("none")}>None</Button>
            </ButtonGroup>
            {settings.reorderer !== "react-flip-toolkit" && (
              <>
                <InputGroup>
                  <Label>Duration</Label>
                  <input type="number" min={0} max={10000} step={100} value={settings.duration ?? ""} onChange={changeWithNumber("duration")} />
                  <label>ms</label>
                </InputGroup>
                <InputGroup className="w-80">
                  <Label><a className="underline underline-offset-2 decoration-slate-400 cursor-pointer" href="https://cubic-bezier.com" target="_blank">Easing</a></Label>
                  <input className="!w-80" type="text" value={settings.easing ?? ""} onChange={changeWithText('easing')} />
                  {invalidEasing && <label><MaterialSymbolsErrorOutline className="text-lg !text-red-500" /></label>}
                </InputGroup>
              </>
            )}
            {settings.reorderer === "react-flip-toolkit" && (
              <>
                <InputGroup>
                  <Label>Stiffness</Label>
                  <input type="number" min={0} max={1000} step={1} value={settings.stiffness ?? ""} onChange={changeWithNumber("stiffness")} />
                  <label>Damping</label>
                  <input type="number" min={0} max={1000} step={1} value={settings.damping ?? ""} onChange={changeWithNumber("damping")} />
                </InputGroup>
                <ButtonGroup className="-ml-1">
                  <Button data-selected={match("stiffness", 200) && match("damping", 26)} onClick={() => { change("stiffness")(200)(); change("damping")(26)(); }}>noWobble</Button>
                  <Button data-selected={match("stiffness", 120) && match("damping", 14)} onClick={() => { change("stiffness")(120)(); change("damping")(14)(); }}>gentle</Button>
                  <Button data-selected={match("stiffness", 120) && match("damping", 17)} onClick={() => { change("stiffness")(120)(); change("damping")(17)(); }}>veryGentle</Button>
                  <Button data-selected={match("stiffness", 180) && match("damping", 12)} onClick={() => { change("stiffness")(180)(); change("damping")(12)(); }}>wobbly</Button>
                  <Button data-selected={match("stiffness", 260) && match("damping", 26)} onClick={() => { change("stiffness")(260)(); change("damping")(26)(); }}>stiff</Button>
                </ButtonGroup>
                <ButtonGroup>
                  <Button data-selected={match("rftStagger", "forward")} onClick={change("rftStagger")("forward")}>forward</Button>
                  <Button data-selected={match("rftStagger", "reverse")} onClick={change("rftStagger")("reverse")}>reverse</Button>
                  <Button data-selected={match("rftStagger", "none")} onClick={change("rftStagger")("none")}>none</Button>
                </ButtonGroup>
                {settings.rftStagger !== "none" && (
                  <InputGroup>
                    <Label>Stagger Speed</Label>
                    <input type="number" min={0} max={1} step={0.1} value={settings.rftStaggerSpeed ?? ""} onChange={changeWithNumber("rftStaggerSpeed")} />
                  </InputGroup>
                )}
              </>
            )}
            {settings.reorderer === "1" && (
              <>
                <ButtonGroup>
                  <Button data-selected={settings.fixedSpeed} onClick={change("fixedSpeed")(!settings.fixedSpeed)}>Fixed Speed</Button>
                  <Button data-selected={settings.disableBlur} onClick={change("disableBlur")(!settings.disableBlur)}>Disable Blur</Button>
                  <Button data-selected={settings.disableRotation} onClick={change("disableRotation")(!settings.disableRotation)}>Disable Rotation</Button>
                  <Button data-selected={settings.deferElementDeletion} onClick={change("deferElementDeletion")(!settings.deferElementDeletion)}>Defer Element Deletion</Button>
                  <Button data-selected={settings.delayEntryAnimation} onClick={change("delayEntryAnimation")(!settings.delayEntryAnimation)}>Delay Entry Animation</Button>
                </ButtonGroup>
                {settings.fixedSpeed && (
                  <InputGroup>
                    <Label>Speed</Label>
                    <input type="number" step={0.1} value={settings.speed ?? ""} onChange={changeWithNumber("speed")} />
                    <label>x</label>
                  </InputGroup>
                )}
                <InputGroup>
                  <Label>Blur</Label>
                  <input type="number" step={0.1} min={0} value={settings.blur ?? ""} onChange={changeWithNumber("blur")} />
                  <label>x</label>
                </InputGroup>
              </>
            )}
            {settings.reorderer === "4" && (
              <>
                <ButtonGroup>
                  <Button data-selected={settings.normalizeKeys} onClick={change("normalizeKeys")(!settings.normalizeKeys)}>Normalize Keys</Button>
                  <Button data-selected={settings.useAbsolutePositionOnDelete} onClick={change("useAbsolutePositionOnDelete")(!settings.useAbsolutePositionOnDelete)}>Use Absolute Position On Deleted Elements</Button>
                  <Button data-selected={settings.reconcileCSSAnimation} onClick={change("reconcileCSSAnimation")(!settings.reconcileCSSAnimation)}>Reconcile CSS Animation</Button>
                  <Button data-selected={settings.scalceAnimation} onClick={change("scalceAnimation")(!settings.scalceAnimation)}>Scale Animation</Button>
                  <Button data-selected={settings.parentAnimation} onClick={change("parentAnimation")(!settings.parentAnimation)}>Parent Animation</Button>
                </ButtonGroup>
                <InputGroup>
                  <Label>Deletion Delay</Label>
                  <input type="number" step={0.1} min={0} value={settings.delayDeletion ?? ""} onChange={changeWithNumber("delayDeletion")} />
                  <label>ms</label>
                </InputGroup>
                <InputGroup>
                  <Label>Stagger</Label>
                  <input type="number" step={0.1} min={0} value={settings.stagger ?? ""} onChange={changeWithNumber("stagger")} />
                  <label>ms</label>
                </InputGroup>
                <ButtonGroup>
                  <Button data-selected={match("strategy", "continuous")} onClick={change("strategy")("continuous")}>Continuous</Button>
                  <Button data-selected={match("strategy", "interrupt")} onClick={change("strategy")("interrupt")}>Interrupt</Button>
                  <Button data-selected={match("strategy", "reset")} onClick={change("strategy")("reset")}>Reset</Button>
                </ButtonGroup>
              </>
            )}
          </div>
        </SettingGroup>

        <SettingGroup label="Element">
          <div className="flex gap-2 flex-wrap">
            <InputGroup>
              <label>Width</label>
              <input type="number" min={1} max={100} value={settings.width ?? ""} onChange={changeWithNumber("width")} />
              <label>rem</label>
            </InputGroup>
            <InputGroup>
              <label>Height</label>
              <input type="number" min={1} max={100} value={settings.height ?? ""} onChange={changeWithNumber("height")} />
              <label>rem</label>
            </InputGroup>
            <ButtonGroup>
              <Button data-selected={settings.border} onClick={change("border")(!settings.border)}>Border</Button>
              <Button data-selected={settings.elBackground} onClick={change("elBackground")(!settings.elBackground)}>Background</Button>
              <Button data-selected={settings.text} onClick={change("text")(!settings.text)}>Text</Button>
              <Button data-selected={settings.grow} onClick={change("grow")(!settings.grow)}>Grow</Button>
              <Button data-selected={settings.dropShadow} onClick={change("dropShadow")(!settings.dropShadow)}>Drop Shadow</Button>
              <Button data-selected={settings.control} onClick={change("control")(!settings.control)}>Control</Button>
              <Button data-selected={settings.rounded} onClick={change("rounded")(!settings.rounded)}>Round Corners</Button>
              <Button data-selected={settings.color} onClick={change("color")(!settings.color)}>Colored</Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button data-selected={match('animation', 'none')} onClick={change("animation")("none")}>None</Button>
              <Button data-selected={match('animation', 'appear')} onClick={change("animation")("appear")}>Appear</Button>
              <Button data-selected={match('animation', 'bounce')} onClick={change("animation")("bounce")}>Bounce</Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button data-selected={match('entryExitAnimation', 'opacity')} onClick={change("entryExitAnimation")("opacity")}>Opacity</Button>
              <Button data-selected={match('entryExitAnimation', 'scale')} onClick={change("entryExitAnimation")("scale")}>Scale</Button>
              <Button data-selected={match('entryExitAnimation', 'color')} onClick={change("entryExitAnimation")("color")}>Color</Button>
              <Button data-selected={match('entryExitAnimation', 'none')} onClick={change("entryExitAnimation")("none")}>None</Button>
            </ButtonGroup>
          </div>
        </SettingGroup>
      </div>



      <div className={cn(
        "h-0 grow overflow-y-auto overflow-x-auto",
        settings.flexDir === "column" ? "h-full" : ""
      )}>
        {settings.reorderer === "none" && (
          <div {...parentProps}>
            {childrenProps.map(({ key, ...props }) => <UnmemoizedAnimateChildDiv {...props} key={key} />)}
            <KeylessAnimateChildDiv />
          </div>
        )}
        {settings.reorderer === "react-easy-flip" && (
          <FlipProvider>
            <div {...parentProps} data-flip-root-id="flip-root">
              {childrenProps.map(({ key, ...props }) =>
                <UnmemoizedAnimateChildDiv
                  {...props}
                  key={key}
                  data-flip-id={"flip-item-" + key}
                />)}
              <KeylessAnimateChildDiv />
            </div>
          </FlipProvider>
        )}


        {settings.reorderer === "framer" && (
          <div {...parentProps}>
            {childrenProps.map(({ key, ...props }) =>
              <MotionDiv
                key={key}
                {...props}
                transition={{
                  duration: settings.duration / 1000,
                  ease: "easeInOut",
                }}
              />
            )}
            <KeylessAnimateChildDiv />
          </div>
        )}

        {settings.reorderer === "4" && (
          <div {...parentProps}>
            {settings.separator ? (
              <AnimateChildren
                {...settings}
                disableAnimationReconciliation={!settings.reconcileCSSAnimation}
                disableParentAnimation={!settings.parentAnimation}
                disableScaleAnimation={!settings.scalceAnimation}
              >
                {firstFive.map(({ key, ...props }) => <UnmemoizedAnimateChildDiv {...props} key={key} />)}
                <Separator />
                {restOfFive.map(({ key, ...props }) => <UnmemoizedAnimateChildDiv {...props} key={key} />)}
                <KeylessAnimateChildDiv />
              </AnimateChildren>
            ) : (
              <AnimateChildren
                {...settings}
                disableAnimationReconciliation={!settings.reconcileCSSAnimation}
                disableParentAnimation={!settings.parentAnimation}
                disableScaleAnimation={!settings.scalceAnimation}
              >
                {childrenProps.map(({ key, ...props }) => <UnmemoizedAnimateChildDiv {...props} key={key} />)}
                <KeylessAnimateChildDiv />
              </AnimateChildren>
            )}
          </div>
        )}

        {settings.reorderer === "3" && (
          <div {...parentProps}>
            {settings.separator ? (
              <AnimateChild2 duration={settings.duration} easing={easing}>
                {firstFive.map(({ key, ...props }) => <AnimateChildDiv {...props} key={key} />)}
                <Separator />
                {restOfFive.map(({ key, ...props }) => <AnimateChildDiv {...props} key={key} />)}
                <KeylessAnimateChildDiv />
              </AnimateChild2>
            ) : (
              <AnimateChild2 duration={settings.duration} easing={easing}>
                {childrenProps.map(({ key, ...props }) => <AnimateChildDiv {...props} key={key} />)}
                <KeylessAnimateChildDiv />
              </AnimateChild2>
            )}
          </div>
        )}

        {settings.reorderer === "2" && (
          <div {...parentProps}>
            {settings.separator ? (
              <AnimateChild duration={settings.duration} easing={easing}>
                {firstFive.map(({ key, ...props }) => <AnimateChildDiv {...props} key={key} />)}
                <Separator />
                {restOfFive.map(({ key, ...props }) => <AnimateChildDiv {...props} key={key} />)}
                <KeylessAnimateChildDiv />
              </AnimateChild>
            ) : (
              <AnimateChild duration={settings.duration} easing={easing}>
                {childrenProps.map(({ key, ...props }) => <AnimateChildDiv {...props} key={key} />)}
                <KeylessAnimateChildDiv />
              </AnimateChild>
            )}
          </div>
        )}

        {settings.reorderer === "1" && (
          <div {...parentProps}>
            {
              (() => {
                const animatorProps = {
                  duration: settings.duration,
                  usingFixedSpeed: settings.fixedSpeed,
                  speed: settings.speed,
                  blur: settings.blur,
                  easing: easing,
                  disableRotation: settings.disableRotation,
                  disableBlur: settings.disableBlur,
                  deferElementDeletions: settings.deferElementDeletion,
                  delayEntryAnimation: settings.delayEntryAnimation,
                }
                if (settings.separator) return (
                  <ReorderArray {...animatorProps}>
                    {firstFive.map(({ key, ...props }) => <AnimateChildDiv {...props} key={key} />)}
                    <Separator />
                    {restOfFive.map(({ key, ...props }) => <AnimateChildDiv {...props} key={key} />)}
                    <KeylessAnimateChildDiv />
                  </ReorderArray>
                )
                return (
                  <ReorderArray {...animatorProps}>
                    {childrenProps.map(({ key, ...props }) => <AnimateChildDiv {...props} key={key} />)}
                    <KeylessAnimateChildDiv />
                  </ReorderArray>
                )
              })()
            }
          </div>
        )}

        {settings.reorderer === "viewtransition" && (
          <ViewTransition duration={settings.duration} enabled={isUsingViewTransition} easing={easing}>
            {settings.separator ? (
              <div {...parentProps}>
                {firstFive.map(({ key, style, ...props }) => <AnimateChildDiv {...props} style={{ viewTransitionName: `item-${ key }`, ...style }} key={key} />)}
                <Separator />
                {restOfFive.map(({ key, style, ...props }) => <AnimateChildDiv {...props} style={{ viewTransitionName: `item-${ key }`, ...style }} key={key} />)}
                <KeylessAnimateChildDiv />
              </div>
            ) : (
              <div {...parentProps}>
                {childrenProps.map(({ key, style, ...props }) => <AnimateChildDiv {...props} style={{ viewTransitionName: `item-${ key }`, ...style }} key={key} />)}
                <KeylessAnimateChildDiv />
              </div>
            )}
          </ViewTransition>
        )}

        {settings.reorderer === "react-flip-toolkit" && <Flipper flipKey={array.join('')} spring={{
          stiffness: 300,
          damping: 30,
        }} staggerConfig={{
          default: {
            reverse: settings.rftStagger === "reverse",
            speed: settings.rftStaggerSpeed,
          }
        }}>

          {settings.separator ? (
            <div {...parentProps}>
              {firstFive.map(({ key, style, ...props }) =>
                <Flipped key={key} flipId={key} stagger={settings.rftStagger !== "none"}>
                  <AnimateChildDiv {...props} style={{ transition: `none`, ...style }} key={key} />
                </Flipped>
              )}
              <Flipped key="separator" flipId="separator" stagger={settings.rftStagger !== "none"}>
                <Separator />
              </Flipped>
              {restOfFive.map(({ key, style, ...props }) =>
                <Flipped key={key} flipId={key} stagger={settings.rftStagger !== "none"}>
                  <AnimateChildDiv {...props} style={{ transition: `none`, ...style }} key={key} />
                </Flipped>
              )}
              <KeylessAnimateChildDiv />
            </div>
          ) : (
            <div {...parentProps}>
              {childrenProps.map(({ key, style, ...props }) =>
                <Flipped key={key} flipId={key} stagger={settings.rftStagger !== "none"}>
                  <AnimateChildDiv {...props} style={{ transition: `none`, ...style }} key={key} />
                </Flipped>
              )}
              <Flipped key="static" flipId="static" stagger={settings.rftStagger !== "none"}>
                <KeylessAnimateChildDiv />
              </Flipped>
            </div>
          )}

        </Flipper>}

        {settings.reorderer === "auto-animate" && (
          settings.separator
            ? <AutoAnimate props={parentProps} useAutoAnimateOptions={{
              duration: settings.duration,
              easing: easing,
            }}>
              {firstFive.map(({ key, ...props }) => {
                return (<AnimateChildDiv {...props} key={key} />)
              })}
              <Separator />
              {restOfFive.map(({ key, ...props }) => {
                return (<AnimateChildDiv {...props} key={key} />)
              })}
              <KeylessAnimateChildDiv />
            </AutoAnimate>
            : <AutoAnimate props={parentProps} useAutoAnimateOptions={{
              duration: settings.duration,
              easing: easing,
            }}>
              {childrenProps.map(({ key, ...props }) => {
                return (<AnimateChildDiv {...props} key={key} />)
              })}
              <KeylessAnimateChildDiv />
            </AutoAnimate>

        )}

        {settings.reorderer === "react-magic-motion" && (
          <MagicMotion>
            {settings.separator ? (
              <div {...parentProps}>
                {firstFive.map(({ key, style, ...props }) => <UnmemoizedAnimateChildDiv {...props} style={{ ...style, transition: `none` }} key={key} />)}
                <Separator />
                {restOfFive.map(({ key, style, ...props }) => <UnmemoizedAnimateChildDiv {...props} style={{ ...style, transition: `none` }} key={key} />)}
                <KeylessAnimateChildDiv />
              </div>
            ) : (
              <div {...parentProps}>
                {childrenProps.map(({ key, style, ...props }) => <UnmemoizedAnimateChildDiv {...props} style={{ ...style, transition: `none` }} key={key} />)}
                <KeylessAnimateChildDiv />
              </div>
            )}
          </MagicMotion>
        )}

        {/* Floating Action Bar */}
        <div className="fixed bottom-0 p-3 pl-3 z-[99999]">
          <div className="sticky bottom-0 left-0 flex flex-wrap rounded-xl border p-1 bg-white shadow-md  gap-1 border-slate-300">
            <Button onClick={shuffle}>Shuffle</Button>
            <Button onClick={reverse}>Reverse</Button>
            <Button onClick={add}>Add</Button>
            <Button onClick={deleteOneRandomly}>Delete Random</Button>
            <Button onClick={deleteHalfRandomly}>Delete Half Randomly</Button>
            <Separator />
            <Button onClick={addOrRemove3}>Toggle (3)</Button>
          </div>
        </div>
      </div>

    </div >
  );
}

function useControls(initialLength: number, isUsingViewTransition: boolean) {
  const initLength = initialLength
  const idRef = useRef(initLength)
  const [array, setArray] = useState(Array.from({ length: initLength }, (_, index) => index))
  const shuffle = () => {
    if (isUsingViewTransition)
      return document.startViewTransition(() => setArray(prev => prev.toSorted(() => Math.random() - 0.5)))
    setArray(prev => prev.toSorted(() => Math.random() - 0.5))
  }
  const reverse = () => setArray(prev => prev.toReversed())
  const add = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    if (e.shiftKey) {
      setArray(prev => prev.concat(Array.from({ length: 10 }, (_, index) => idRef.current + index)))
      idRef.current += 10
      return
    }
    setArray(prev => [...prev, idRef.current++])
  }
  const addOrRemove3 = () => {
    if (array.includes(3)) remove(3)
    else setArray(prev => prev.slice(0, 3).concat(3, prev.slice(3)))
  }
  const remove = (key: number) => setArray(prev => prev.filter(item => item !== key))

  const moveUp = (key: number) => {
    const index = array.indexOf(key)
    if (index === 0) return
    const newArray = [...array]
    newArray[index] = array[index - 1]
    newArray[index - 1] = key
    setArray(newArray)
  }
  const moveDown = (key: number) => {
    const index = array.indexOf(key)
    if (index === array.length - 1) return
    const newArray = [...array]
    newArray[index] = array[index + 1]
    newArray[index + 1] = key
    setArray(newArray)
  }
  const deleteHalfRandomly = () => {
    setArray(prev => prev.filter(() => Math.random() > 0.5))
  }
  const deleteOneRandomly = () => {
    setArray(prev => {
      const index = Math.floor(Math.random() * prev.length)
      return prev.filter((_, i) => i !== index)
    })
  }

  return {
    array,
    shuffle,
    reverse,
    add,
    addOrRemove3,
    remove,
    moveUp,
    moveDown,
    deleteHalfRandomly,
    deleteOneRandomly,
  }
}

function useSettings() {
  const init: {
    initialLength: number,
    flexDir: "row" | "column",
    justify: "start" | "center" | "end" | "stretch",
    items: "start" | "center" | "end" | "stretch",
    width: number,
    height: number,
    grow: boolean,
    duration: number,
    reorderer: "4" | "framer" | "3" | "2" | "1" | "viewtransition" | "react-flip-toolkit" | "auto-animate" | "react-magic-motion" | "none" | "react-easy-flip",
    gap: number,
    stiffness: number,
    damping: number,
    rftStagger: "forward" | "reverse" | "none",
    rftStaggerSpeed: number,
    easing: "ease-in" | "ease-out" | "ease-in-out" | "linear" | ({} & string),
    fixedSpeed: boolean,
    speed: number,
    blur: number,
    disableRotation: boolean,
    disableBlur: boolean,
    deferElementDeletion: boolean,
    delayEntryAnimation: boolean,
    dropShadow: boolean,
    control: boolean,
    animation: "none" | "appear" | "bounce",
    separator: boolean,
    normalizeKeys: boolean,
    delayDeletion: number,
    useAbsolutePositionOnDelete: boolean,
    stagger: number,
    strategy: "interrupt" | "continuous" | "reset",
    entryExitAnimation: "opacity" | "scale" | "color" | "none",
    rounded: boolean,
    color: boolean,
    background: boolean,
    reconcileCSSAnimation: boolean,
    scalceAnimation: boolean,
    parentAnimation: boolean,
    text: boolean,
    elBackground: boolean,
    border: boolean,
    overflow: "hidden" | "visible",
  } = {
    initialLength: 100,
    flexDir: "row",
    justify: "start",
    items: "start",
    width: 8,
    height: 3,
    grow: false,
    duration: 500,
    reorderer: "4",
    gap: 4,
    stiffness: 200,
    damping: 26,
    rftStagger: "none",
    rftStaggerSpeed: 0.1,
    easing: "ease-in-out",
    fixedSpeed: false,
    speed: 1,
    blur: 1,
    disableRotation: false,
    disableBlur: false,
    deferElementDeletion: false,
    delayEntryAnimation: false,
    dropShadow: false,
    control: true,
    animation: "none",
    separator: true,
    normalizeKeys: true,
    delayDeletion: 500,
    useAbsolutePositionOnDelete: false,
    stagger: 0,
    strategy: "continuous",
    entryExitAnimation: "opacity",
    rounded: true,
    color: true,
    background: true,
    reconcileCSSAnimation: true,
    scalceAnimation: true,
    parentAnimation: true,
    text: true,
    elBackground: true,
    border: true,
    overflow: "visible",
  }

  const readonlysp = useSearchParams()
  const spdata = Object.fromEntries(
    Object
      .entries(init)
      .map(([key, value]) => [key, JSON.parse(readonlysp.get(key) ?? "null") ?? value])
  ) as typeof init

  const [data, setData] = useState(spdata)

  const change =
    <T extends keyof typeof init>(what: T) =>
      (into: typeof init[T]) =>
        () => {
          const url = new URL(window.location.href)
          url.searchParams.set(what, JSON.stringify(into))
          window.history.pushState(null, '', url.toString())
          setData(prev => ({ ...prev, [what]: into }))
        }

  const changeWithNumber =
    <T extends keyof typeof init>(what: T) =>
      (e: ChangeEvent<HTMLInputElement>) => {
        const url = new URL(window.location.href)
        const value = e.target.valueAsNumber
        if (isNaN(value)) {
          url.searchParams.delete(what)
          window.history.pushState(null, '', url.toString())
          setData(prev => ({ ...prev, [what]: undefined }))
          return
        }
        url.searchParams.set(what, JSON.stringify(value))
        window.history.pushState(null, '', url.toString())
        setData(prev => ({ ...prev, [what]: value }))
      }

  const changeWithText =
    <T extends keyof typeof init>(what: T) =>
      (e: ChangeEvent<HTMLInputElement>) => {
        const url = new URL(window.location.href)
        const value = e.target.value
        if (value === "") {
          url.searchParams.delete(what)
          window.history.pushState(null, '', url.toString())
          setData(prev => ({ ...prev, [what]: undefined }))
          return
        }
        url.searchParams.set(what, JSON.stringify(value))
        window.history.replaceState(null, '', url.toString())
        setData(prev => ({ ...prev, [what]: value }))
      }

  const match = <T extends keyof typeof init>(what: T, withValue: typeof init[T]) => withValue === spdata[what]

  return {
    change,
    changeWithNumber,
    changeWithText,
    settings: data,
    match,
  }
}

function SettingGroup(
  { className, label, ...props }: ComponentProps<"div"> & {
    label: string,
  }
) {
  const [opened, setOpened] = useState(true)
  const firstRef = useRef<boolean>(true)

  const contentRef = useRef<HTMLDivElement>(null)
  const parentRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!contentRef.current) return
    if (opened) {
      contentRef.current.style.height = `auto`
      if (!firstRef.current) {
        const anim = contentRef.current.animate([
          { height: 0 },
          { height: `${ contentRef.current.scrollHeight }px` },
        ], {
          duration: contentRef.current.scrollHeight * 4,
          easing: "ease-in-out",
        })
        anim.onfinish = () => anim.cancel()
      }
    }
    if (!opened) {
      contentRef.current.style.height = `0px`
      if (!firstRef.current) {
        const anim = contentRef.current.animate([
          { height: `${ contentRef.current.scrollHeight }px` },
          { height: 0 },
        ], {
          duration: contentRef.current.scrollHeight * 4,
          easing: "ease-in-out",
        })
        anim.onfinish = () => anim.cancel()
      }
    }
    firstRef.current = false
  }, [opened])


  return (
    <div className="flex flex-col gap-1" ref={parentRef}>
      <div onClick={() => {
        setOpened(!opened)
      }} className="self-start text-[0.6rem] font-bold uppercase text-slate-500 cursor-pointer hover:text-slate-800 select-none">
        <MynauiChevronRightSolid className="inline text-[1.3em] data-[opened]:rotate-90 align-[-2.5px]" data-opened={opened ? "" : undefined} /> {label}
      </div>
      <div ref={contentRef} className='overflow-hidden'>
        {props.children}
      </div>
    </div>
  )
}

export function MynauiChevronRightSolid(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M9.53 5.47a.75.75 0 0 0-1.06 0v13.06a.75.75 0 0 0 1.06 0l6-6a.75.75 0 0 0 0-1.06z"></path></svg>
  )
}

function Separator(
  { className, ...props }: ComponentProps<"div">
) {
  return (
    <div className={cn("mx-2 self-stretch border-r", className)} {...props} />
  )
}

function InputGroup(
  { className, ...props }: ComponentProps<"div">
) {
  return (
    <div
      className={cn(
        "h-9 flex items-center gap-2 p-1.5 px-3 border rounded-lg bg-slate-100 text-sm font-medium",

        "shadow-[inset_0px_1px_4px_0px_#43679a22]",

        "focus-within:outline",
        "focus-within:outline-1",
        "focus-within:outline-slate-400",

        // "focus-within:[&_input]:outline-none",

        "[&_label]:text-slate-500",
        "[&_svg]:text-slate-500",
        "[&_label]:text-xs",
        "[&_label]:font-medium",

        "[&_input]:bg-white",
        "[&_input]:w-20",
        "[&_input]:-my-1.5",
        "[&_input]:leading-9",
        "[&_input]:self-stretch",
        "[&_input:last-child]:rounded-r-lg",
        "[&_input:last-child]:-mr-3",
        "[&_input]:pl-3",
        "[&_input]:rounded-md",
        "[&_input]:text-slate-600",
        "[&_input]:outline",
        "[&_input]:outline-1",
        "[&_input]:outline-slate-200",
        className
      )}
      {...props}
    />
  )
}

function Label(
  { className, ...props }: ComponentProps<"label">
) {
  return (
    <label
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  )
}

function ButtonGroup(
  { className, ...props }: ComponentProps<"div">
) {
  return (
    <div
      className={cn("h-9 p-0.5 bg-slate-100 rounded-lg gap-0.5 flex border items-stretch",
        "shadow-[inset_0px_1px_4px_0px_#43679a22]",

        "overflow-x-auto hide-scrollbar",
        "[&_button]:text-xs",
        "[&_button]:rounded-md",
        "[&_button]:py-1",
        "[&_button]:text-slate-400",
        "hover:[&_button]:text-slate-500",
        "hover:[&_button]:bg-white/50",
        "data-[selected=true]:[&_button]:text-slate-700",
        "data-[selected=true]:[&_button]:bg-white",

        "focus-within:[&_button]:outline-transparent",
        "active:[&_button]:outline-transparent",

        "data-[selected=true]:[&_button]:outline",
        "data-[selected=true]:[&_button]:outline-1",
        "data-[selected=true]:[&_button]:outline-slate-200",

        "[&_label]:self-center",
        "[&_label]:text-xs",
        "[&_label]:text-slate-600",
        "[&_label]:pl-3",
        "[&_label]:pr-2",
        className
      )}
      {...props}
    />
  )
}

function Button(
  { className, ...props }: ComponentProps<"button">
) {
  return (
    <button
      className={cn(
        "p-1.5 px-3.5 text-black/80 rounded-lg hover:bg-slate-100 active:bg-slate-200 data-[selected=true]:bg-slate-100 text-sm font-medium shrink-0",
        "focus-within:outline",
        "focus-within:outline-1",
        "focus-within:outline-slate-400",
        className)}
      {...props}
    />
  )
}


const spring = {
  type: "spring",
  damping: 25,
  stiffness: 120
};
const MotionDiv = function MotionDiv(
  { className, ...props }: ComponentProps<typeof motion['div']>
) {
  return (
    <AnimatePresence>
      <motion.div
        className={cn("card", className)}
        {...props}
        layout
        style={{
          transition: `none`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
    </AnimatePresence>
  )
}

const AnimateChildDiv = memo(function AnimateChildDiv(
  { className, ...props }: ComponentProps<"div">
) {
  return (
    <UnmemoizedAnimateChildDiv
      className={cn(
        "card",
        className,
      )}
      {...props}
    />
  )
})

export const KeylessAnimateChildDiv = (
  { className, ...props }: ComponentProps<"div">
) => {
  return (
    <UnmemoizedAnimateChildDiv
      className={cn("card", className)} {...props}
    >no key</UnmemoizedAnimateChildDiv>
  )
}

export const UnmemoizedAnimateChildDiv = function UnmemoizedAnimateChildDiv(
  { className, ...props }: ComponentProps<"div">
) {
  return (
    <div
      className={cn(
        "card group",
        className,
      )}
      {...props}
    />
  )
}


export function MaterialSymbolsWidthRounded(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m6.825 13l.875.925q.275.275.275.688T7.7 15.3q-.3.3-.712.3t-.688-.3l-2.6-2.575q-.15-.15-.225-.337T3.4 12t.075-.375t.225-.325l2.6-2.6q.275-.275.688-.275T7.7 8.7q.3.3.3.713t-.3.712L6.825 11h10.35l-.9-.9Q16 9.825 16 9.413t.3-.713q.275-.275.688-.275t.712.275l2.575 2.6q.15.15.225.325t.075.375t-.075.387t-.225.338l-2.6 2.6q-.275.275-.687.275t-.713-.3Q16 15.025 16 14.613t.275-.688l.9-.925z"></path></svg>
  )
}

export function MaterialSymbolsErrorOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 17q.425 0 .713-.288T13 16t-.288-.712T12 15t-.712.288T11 16t.288.713T12 17m-1-4h2V7h-2zm1 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"></path></svg>
  )
}


export function MaterialSymbolsArrowBack2Rounded(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M6.325 12.85q-.225-.15-.337-.375T5.874 12t.113-.475t.337-.375l8.15-5.175q.125-.075.263-.112T15 5.825q.4 0 .7.288t.3.712v10.35q0 .425-.3.713t-.7.287q-.125 0-.262-.038t-.263-.112z"></path></svg>
  )
}


export function MaterialSymbolsCloseRounded(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"></path></svg>
  )
}

const listOfColorsinHex = [
  "#292f56",
  "#2a2c5b",
  "#2f2b61",
  "#362c67",
  "#3e2d6d",
  "#482d73",
  "#522e79",
  "#5d2e7f",
  "#6a2e85",
  "#782f8b",
  "#872f92",
  "#982f98",
  "#9f2f94",
  "#a62e8d",
  "#ac2e86",
  "#b32e7d",
  "#ba2d72",
  "#c22c66",
  "#c92c58",
  "#d02b49",
  "#d62c39",
  "#d9332f",
  "#dc4833",
  "#df5d36",
  "#e2723a",
  "#e4863e",
  "#e79b42",
  "#e9af46",
  "#ebc24a",
  "#eed54f",
  "#f0e853",
  "#eaf258",
  "#dcf45c",
  "#cff561",
  "#c3f766",
  "#b7f96b",
  "#acfa70",
]