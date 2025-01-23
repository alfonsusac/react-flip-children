"use client"

import { useState } from "react"

export function Transform() {

  const init = {
    transformRotate: 0,
    rotate: 0,
    transformTranslateX: 0,
    transformTranslateY: 0,
    translateX: 0,
    translateY: 0,
    transformScale: 1,
    scale: 1,
  }
  const [prop, setProp] = useState(init)
  const { transformRotate, transformTranslateX, transformTranslateY, rotate, translateX, translateY, transformScale, scale } = prop
  const onTransformRotate = (e: React.ChangeEvent<HTMLInputElement>) => setProp({ ...prop, transformRotate: e.currentTarget.valueAsNumber })
  const onTransformTranslateX = (e: React.ChangeEvent<HTMLInputElement>) => setProp({ ...prop, transformTranslateX: e.currentTarget.valueAsNumber })
  const onTransformTranslateY = (e: React.ChangeEvent<HTMLInputElement>) => setProp({ ...prop, transformTranslateY: e.currentTarget.valueAsNumber })
  const onRotate = (e: React.ChangeEvent<HTMLInputElement>) => setProp({ ...prop, rotate: e.currentTarget.valueAsNumber })
  const onTranslateX = (e: React.ChangeEvent<HTMLInputElement>) => setProp({ ...prop, translateX: e.currentTarget.valueAsNumber })
  const onTranslateY = (e: React.ChangeEvent<HTMLInputElement>) => setProp({ ...prop, translateY: e.currentTarget.valueAsNumber })
  const onTransformScale = (e: React.ChangeEvent<HTMLInputElement>) => setProp({ ...prop, transformScale: e.currentTarget.valueAsNumber })
  const onScale = (e: React.ChangeEvent<HTMLInputElement>) => setProp({ ...prop, scale: e.currentTarget.valueAsNumber })
  const reset = () => setProp(init)

  const labelClassName = "mt-2 text-sm"
  return (
    <div className="flex flex-row justify-center gap-8">
      <div className="flex flex-col w-40">
        <button onClick={reset}>Reset</button>
        <label className={labelClassName}>Transform Rotate</label>
        <input value={transformRotate} onChange={onTransformRotate} type="range" min={-360} max={360} />
        <label className={labelClassName}>Transform Translate X</label>
        <input value={transformTranslateX} onChange={onTransformTranslateX} type="range" min={-100} max={100} />
        <label className={labelClassName}>Transform Translate Y</label>
        <input value={transformTranslateY} onChange={onTransformTranslateY} type="range" min={-100} max={100} />

        <label className={labelClassName}>Rotate</label>
        <input value={rotate} onChange={onRotate} type="range" min={-360} max={360} />
        <label className={labelClassName}>Translate X</label>
        <input value={translateX} onChange={onTranslateX} type="range" min={-100} max={100} />
        <label className={labelClassName}>Translate Y</label>
        <input value={translateY} onChange={onTranslateY} type="range" min={-100} max={100} />

        <label className={labelClassName}>Transform Scale</label>
        <input value={transformScale} onChange={onTransformScale} type="range" min={0} max={2} step={0.1} />
        <label className={labelClassName}>Scale</label>
        <input value={scale} onChange={onScale} type="range" min={0} max={2} step={0.1} />
      </div>
      <div className="flex flex-col items-center justify-center w-80 h-80 border rounded-lg bg-black/5 overflow-hidden">
        <div className="w-20 h-20 bg-white border rounded-lg shadow-md"
          style={{
            transform: `rotate(${ transformRotate }deg) translateX(${ transformTranslateX }px) translateY(${ transformTranslateY }px) scale(${ transformScale })`,
            translate: `${ translateX }px ${ translateY }px`,
            rotate: `${ rotate }deg`,
            scale: `${ scale }`,
          }}
        />
      </div>
    </div>
  )
}