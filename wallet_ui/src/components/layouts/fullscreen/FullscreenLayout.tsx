import { CSSProperties, PropsWithChildren } from 'react'
import './style.css'

type IFullscreenLayoutProps = {
  className?: string
  style?: CSSProperties
}

export function FullscreenLayout(props: PropsWithChildren<IFullscreenLayoutProps>) {
  return (
    <div className={`fullscreen-layout ${props.className}`} style={props.style}>
      {props.children}
    </div>
  )
}
