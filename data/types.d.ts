import type {
  domEventInterfaces,
  htmlDomEvents,
  mathMlTags,
  svgEvents,
  svgTags,
  webComponentsInterfaces,
} from "./types.ts";
import type {
  domInterfaces,
  htmlDomInterfaces,
  htmlTags,
  jsInterfaces,
  jsTypedArrayInterfaces,
  svgInterfaces,
  urlFragmentInterfaces,
  webAnimationsInterfaces,
} from "./types.ts";

export type DomEventInterfaces = Readonly<typeof domEventInterfaces[number]>;
export type DomInterfaces = Readonly<typeof domInterfaces[number]>;
export type HtmlDomEvents = Readonly<typeof htmlDomEvents[number]>;
export type HtmlDomInterfaces = Readonly<typeof htmlDomInterfaces[number]>;
export type HtmlTags = Readonly<typeof htmlTags[number]>;
export type JsInterfaces = Readonly<typeof jsInterfaces[number]>;
export type JsTypedArrayInterfaces = Readonly<
  typeof jsTypedArrayInterfaces[number]
>;
export type MathMLInterface = Readonly<"MathMLElement">;
export type MathMlTags = Readonly<typeof mathMlTags[number]>;
export type SvgEvents = Readonly<typeof svgEvents[number]>;
export type SvgInterfaces = Readonly<typeof svgInterfaces[number]>;
export type SvgTags = Readonly<typeof svgTags[number]>;
export type UrlFragmentInterfaces = Readonly<typeof urlFragmentInterfaces>;
export type WebAnimationsInterfaces = Readonly<
  typeof webAnimationsInterfaces[number]
>;
export type webComponentsInterfaces = Readonly<
  typeof webComponentsInterfaces[number]
>;
