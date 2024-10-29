import { assert } from "@std/assert";
import json from "../globals.json" with { type: "json" };

const globalKeys = new Set(Object.keys(json));

// Verify that non-global interfaces and variables do NOT exist
// =============================================================

Deno.test("Test AsyncFunction does NOT exist", () => {
  assert(!globalKeys.has("AsyncFunction"));
});

Deno.test("Test Float16Array does NOT exist", () => {
  assert(!globalKeys.has("Float16Array"));
});

Deno.test("Test TypedArray does NOT exist", () => {
  assert(!globalKeys.has("TypedArray"));
});

Deno.test("Test undefined does NOT exist", () => {
  assert(!globalKeys.has("undefined"));
});

// Next, verify that the interfaces that SHOULD be defined, are.
// =============================================================

Deno.test("Test AsyncGenerator exists", () => {
  assert(globalKeys.has("AsyncGenerator"));
});

Deno.test("Test AsyncGeneratorFunction exists", () => {
  assert(globalKeys.has("AsyncGeneratorFunction"));
});

Deno.test("Test Generator exists", () => {
  assert(globalKeys.has("Generator"));
});

Deno.test("Test GeneratorFunction exists", () => {
  assert(globalKeys.has("GeneratorFunction"));
});

Deno.test("Test AbortController exists", () => {
  assert(globalKeys.has("AbortController"));
});

Deno.test("Test AbortSignal exists", () => {
  assert(globalKeys.has("AbortSignal"));
});

Deno.test("Test AbstractRange exists", () => {
  assert(globalKeys.has("AbstractRange"));
});

Deno.test("Test AggregateError exists", () => {
  assert(globalKeys.has("AggregateError"));
});

Deno.test("Test AnalyserNode exists", () => {
  assert(globalKeys.has("AnalyserNode"));
});

Deno.test("Test Animation exists", () => {
  assert(globalKeys.has("Animation"));
});

Deno.test("Test AnimationEffect exists", () => {
  assert(globalKeys.has("AnimationEffect"));
});

Deno.test("Test AnimationEvent exists", () => {
  assert(globalKeys.has("AnimationEvent"));
});

Deno.test("Test AnimationPlaybackEvent exists", () => {
  assert(globalKeys.has("AnimationPlaybackEvent"));
});

Deno.test("Test AnimationTimeline exists", () => {
  assert(globalKeys.has("AnimationTimeline"));
});

Deno.test("Test Array exists", () => {
  assert(globalKeys.has("Array"));
});

Deno.test("Test ArrayBuffer exists", () => {
  assert(globalKeys.has("ArrayBuffer"));
});

Deno.test("Test Atomics exists", () => {
  assert(globalKeys.has("Atomics"));
});

Deno.test("Test Attr exists", () => {
  assert(globalKeys.has("Attr"));
});

Deno.test("Test AudioBuffer exists", () => {
  assert(globalKeys.has("AudioBuffer"));
});

Deno.test("Test AudioBufferSourceNode exists", () => {
  assert(globalKeys.has("AudioBufferSourceNode"));
});

Deno.test("Test AudioContext exists", () => {
  assert(globalKeys.has("AudioContext"));
});

Deno.test("Test AudioData exists", () => {
  assert(globalKeys.has("AudioData"));
});

Deno.test("Test AudioDecoder exists", () => {
  assert(globalKeys.has("AudioDecoder"));
});

Deno.test("Test AudioDestinationNode exists", () => {
  assert(globalKeys.has("AudioDestinationNode"));
});

Deno.test("Test AudioEncoder exists", () => {
  assert(globalKeys.has("AudioEncoder"));
});

Deno.test("Test AudioListener exists", () => {
  assert(globalKeys.has("AudioListener"));
});

Deno.test("Test AudioNode exists", () => {
  assert(globalKeys.has("AudioNode"));
});

Deno.test("Test AudioParam exists", () => {
  assert(globalKeys.has("AudioParam"));
});

Deno.test("Test AudioParamMap exists", () => {
  assert(globalKeys.has("AudioParamMap"));
});

Deno.test("Test AudioProcessingEvent exists", () => {
  assert(globalKeys.has("AudioProcessingEvent"));
});

Deno.test("Test AudioScheduledSourceNode exists", () => {
  assert(globalKeys.has("AudioScheduledSourceNode"));
});

Deno.test("Test AudioWorklet exists", () => {
  assert(globalKeys.has("AudioWorklet"));
});

Deno.test("Test AudioWorkletNode exists", () => {
  assert(globalKeys.has("AudioWorkletNode"));
});

Deno.test("Test AuthenticatorAssertionResponse exists", () => {
  assert(globalKeys.has("AuthenticatorAssertionResponse"));
});

Deno.test("Test AuthenticatorAttestationResponse exists", () => {
  assert(globalKeys.has("AuthenticatorAttestationResponse"));
});

Deno.test("Test AuthenticatorResponse exists", () => {
  assert(globalKeys.has("AuthenticatorResponse"));
});

Deno.test("Test BarProp exists", () => {
  assert(globalKeys.has("BarProp"));
});

Deno.test("Test BaseAudioContext exists", () => {
  assert(globalKeys.has("BaseAudioContext"));
});

Deno.test("Test BeforeUnloadEvent exists", () => {
  assert(globalKeys.has("BeforeUnloadEvent"));
});

Deno.test("Test BigInt exists", () => {
  assert(globalKeys.has("BigInt"));
});

Deno.test("Test BigInt64Array exists", () => {
  assert(globalKeys.has("BigInt64Array"));
});

Deno.test("Test BigUint64Array exists", () => {
  assert(globalKeys.has("BigUint64Array"));
});

Deno.test("Test BiquadFilterNode exists", () => {
  assert(globalKeys.has("BiquadFilterNode"));
});

Deno.test("Test Blob exists", () => {
  assert(globalKeys.has("Blob"));
});

Deno.test("Test BlobEvent exists", () => {
  assert(globalKeys.has("BlobEvent"));
});

Deno.test("Test Boolean exists", () => {
  assert(globalKeys.has("Boolean"));
});

Deno.test("Test BroadcastChannel exists", () => {
  assert(globalKeys.has("BroadcastChannel"));
});

Deno.test("Test ByteLengthQueuingStrategy exists", () => {
  assert(globalKeys.has("ByteLengthQueuingStrategy"));
});

Deno.test("Test Cache exists", () => {
  assert(globalKeys.has("Cache"));
});

Deno.test("Test CacheStorage exists", () => {
  assert(globalKeys.has("CacheStorage"));
});

Deno.test("Test CanvasCaptureMediaStreamTrack exists", () => {
  assert(globalKeys.has("CanvasCaptureMediaStreamTrack"));
});

Deno.test("Test CanvasGradient exists", () => {
  assert(globalKeys.has("CanvasGradient"));
});

Deno.test("Test CanvasPattern exists", () => {
  assert(globalKeys.has("CanvasPattern"));
});

Deno.test("Test CanvasRenderingContext2D exists", () => {
  assert(globalKeys.has("CanvasRenderingContext2D"));
});

Deno.test("Test CaretPosition exists", () => {
  assert(globalKeys.has("CaretPosition"));
});

Deno.test("Test CDATASection exists", () => {
  assert(globalKeys.has("CDATASection"));
});

Deno.test("Test ChannelMergerNode exists", () => {
  assert(globalKeys.has("ChannelMergerNode"));
});

Deno.test("Test ChannelSplitterNode exists", () => {
  assert(globalKeys.has("ChannelSplitterNode"));
});

Deno.test("Test CharacterData exists", () => {
  assert(globalKeys.has("CharacterData"));
});

Deno.test("Test Client exists", () => {
  assert(globalKeys.has("Client"));
});

Deno.test("Test Clients exists", () => {
  assert(globalKeys.has("Clients"));
});

Deno.test("Test Clipboard exists", () => {
  assert(globalKeys.has("Clipboard"));
});

Deno.test("Test ClipboardEvent exists", () => {
  assert(globalKeys.has("ClipboardEvent"));
});

Deno.test("Test ClipboardItem exists", () => {
  assert(globalKeys.has("ClipboardItem"));
});

Deno.test("Test CloseEvent exists", () => {
  assert(globalKeys.has("CloseEvent"));
});

Deno.test("Test Comment exists", () => {
  assert(globalKeys.has("Comment"));
});

Deno.test("Test CompositionEvent exists", () => {
  assert(globalKeys.has("CompositionEvent"));
});

Deno.test("Test CompressionStream exists", () => {
  assert(globalKeys.has("CompressionStream"));
});

Deno.test("Test console exists", () => {
  assert(globalKeys.has("console"));
});

Deno.test("Test ConstantSourceNode exists", () => {
  assert(globalKeys.has("ConstantSourceNode"));
});

Deno.test("Test ContentVisibilityAutoStateChangeEvent exists", () => {
  assert(globalKeys.has("ContentVisibilityAutoStateChangeEvent"));
});

Deno.test("Test ConvolverNode exists", () => {
  assert(globalKeys.has("ConvolverNode"));
});

Deno.test("Test CountQueuingStrategy exists", () => {
  assert(globalKeys.has("CountQueuingStrategy"));
});

Deno.test("Test Credential exists", () => {
  assert(globalKeys.has("Credential"));
});

Deno.test("Test CredentialsContainer exists", () => {
  assert(globalKeys.has("CredentialsContainer"));
});

Deno.test("Test Crypto exists", () => {
  assert(globalKeys.has("Crypto"));
});

Deno.test("Test CryptoKey exists", () => {
  assert(globalKeys.has("CryptoKey"));
});

Deno.test("Test CSS exists", () => {
  assert(globalKeys.has("CSS"));
});

Deno.test("Test CSSAnimation exists", () => {
  assert(globalKeys.has("CSSAnimation"));
});

Deno.test("Test CSSConditionRule exists", () => {
  assert(globalKeys.has("CSSConditionRule"));
});

Deno.test("Test CSSContainerRule exists", () => {
  assert(globalKeys.has("CSSContainerRule"));
});

Deno.test("Test CSSCounterStyleRule exists", () => {
  assert(globalKeys.has("CSSCounterStyleRule"));
});

Deno.test("Test CSSFontFaceRule exists", () => {
  assert(globalKeys.has("CSSFontFaceRule"));
});

Deno.test("Test CSSFontFeatureValuesRule exists", () => {
  assert(globalKeys.has("CSSFontFeatureValuesRule"));
});

Deno.test("Test CSSFontPaletteValuesRule exists", () => {
  assert(globalKeys.has("CSSFontPaletteValuesRule"));
});

Deno.test("Test CSSGroupingRule exists", () => {
  assert(globalKeys.has("CSSGroupingRule"));
});

Deno.test("Test CSSImageValue exists", () => {
  assert(globalKeys.has("CSSImageValue"));
});

Deno.test("Test CSSImportRule exists", () => {
  assert(globalKeys.has("CSSImportRule"));
});

Deno.test("Test CSSKeyframeRule exists", () => {
  assert(globalKeys.has("CSSKeyframeRule"));
});

Deno.test("Test CSSKeyframesRule exists", () => {
  assert(globalKeys.has("CSSKeyframesRule"));
});

Deno.test("Test CSSKeywordValue exists", () => {
  assert(globalKeys.has("CSSKeywordValue"));
});

Deno.test("Test CSSLayerBlockRule exists", () => {
  assert(globalKeys.has("CSSLayerBlockRule"));
});

Deno.test("Test CSSLayerStatementRule exists", () => {
  assert(globalKeys.has("CSSLayerStatementRule"));
});

Deno.test("Test CSSMathInvert exists", () => {
  assert(globalKeys.has("CSSMathInvert"));
});

Deno.test("Test CSSMathMax exists", () => {
  assert(globalKeys.has("CSSMathMax"));
});

Deno.test("Test CSSMathMin exists", () => {
  assert(globalKeys.has("CSSMathMin"));
});

Deno.test("Test CSSMathNegate exists", () => {
  assert(globalKeys.has("CSSMathNegate"));
});

Deno.test("Test CSSMathProduct exists", () => {
  assert(globalKeys.has("CSSMathProduct"));
});

Deno.test("Test CSSMathSum exists", () => {
  assert(globalKeys.has("CSSMathSum"));
});

Deno.test("Test CSSMathValue exists", () => {
  assert(globalKeys.has("CSSMathValue"));
});

Deno.test("Test CSSMatrixComponent exists", () => {
  assert(globalKeys.has("CSSMatrixComponent"));
});

Deno.test("Test CSSMediaRule exists", () => {
  assert(globalKeys.has("CSSMediaRule"));
});

Deno.test("Test CSSNamespaceRule exists", () => {
  assert(globalKeys.has("CSSNamespaceRule"));
});

Deno.test("Test CSSNumericArray exists", () => {
  assert(globalKeys.has("CSSNumericArray"));
});

Deno.test("Test CSSNumericValue exists", () => {
  assert(globalKeys.has("CSSNumericValue"));
});

Deno.test("Test CSSPageRule exists", () => {
  assert(globalKeys.has("CSSPageRule"));
});

Deno.test("Test CSSPerspective exists", () => {
  assert(globalKeys.has("CSSPerspective"));
});

Deno.test("Test CSSPropertyRule exists", () => {
  assert(globalKeys.has("CSSPropertyRule"));
});

Deno.test("Test CSSRotate exists", () => {
  assert(globalKeys.has("CSSRotate"));
});

Deno.test("Test CSSRule exists", () => {
  assert(globalKeys.has("CSSRule"));
});

Deno.test("Test CSSRuleList exists", () => {
  assert(globalKeys.has("CSSRuleList"));
});

Deno.test("Test CSSScale exists", () => {
  assert(globalKeys.has("CSSScale"));
});

Deno.test("Test CSSScopeRule exists", () => {
  assert(globalKeys.has("CSSScopeRule"));
});

Deno.test("Test CSSSkew exists", () => {
  assert(globalKeys.has("CSSSkew"));
});

Deno.test("Test CSSSkewX exists", () => {
  assert(globalKeys.has("CSSSkewX"));
});

Deno.test("Test CSSSkewY exists", () => {
  assert(globalKeys.has("CSSSkewY"));
});

Deno.test("Test CSSStartingStyleRule exists", () => {
  assert(globalKeys.has("CSSStartingStyleRule"));
});

Deno.test("Test CSSStyleDeclaration exists", () => {
  assert(globalKeys.has("CSSStyleDeclaration"));
});

Deno.test("Test CSSStyleRule exists", () => {
  assert(globalKeys.has("CSSStyleRule"));
});

Deno.test("Test CSSStyleSheet exists", () => {
  assert(globalKeys.has("CSSStyleSheet"));
});

Deno.test("Test CSSStyleValue exists", () => {
  assert(globalKeys.has("CSSStyleValue"));
});

Deno.test("Test CSSSupportsRule exists", () => {
  assert(globalKeys.has("CSSSupportsRule"));
});

Deno.test("Test CSSTransformComponent exists", () => {
  assert(globalKeys.has("CSSTransformComponent"));
});

Deno.test("Test CSSTransformValue exists", () => {
  assert(globalKeys.has("CSSTransformValue"));
});

Deno.test("Test CSSTransition exists", () => {
  assert(globalKeys.has("CSSTransition"));
});

Deno.test("Test CSSTranslate exists", () => {
  assert(globalKeys.has("CSSTranslate"));
});

Deno.test("Test CSSUnitValue exists", () => {
  assert(globalKeys.has("CSSUnitValue"));
});

Deno.test("Test CSSUnparsedValue exists", () => {
  assert(globalKeys.has("CSSUnparsedValue"));
});

Deno.test("Test CSSVariableReferenceValue exists", () => {
  assert(globalKeys.has("CSSVariableReferenceValue"));
});

Deno.test("Test CustomElementRegistry exists", () => {
  assert(globalKeys.has("CustomElementRegistry"));
});

Deno.test("Test CustomEvent exists", () => {
  assert(globalKeys.has("CustomEvent"));
});

Deno.test("Test CustomStateSet exists", () => {
  assert(globalKeys.has("CustomStateSet"));
});

Deno.test("Test DataTransfer exists", () => {
  assert(globalKeys.has("DataTransfer"));
});

Deno.test("Test DataTransferItem exists", () => {
  assert(globalKeys.has("DataTransferItem"));
});

Deno.test("Test DataTransferItemList exists", () => {
  assert(globalKeys.has("DataTransferItemList"));
});

Deno.test("Test DataView exists", () => {
  assert(globalKeys.has("DataView"));
});

Deno.test("Test Date exists", () => {
  assert(globalKeys.has("Date"));
});

Deno.test("Test DecompressionStream exists", () => {
  assert(globalKeys.has("DecompressionStream"));
});

Deno.test("Test DedicatedWorkerGlobalScope exists", () => {
  assert(globalKeys.has("DedicatedWorkerGlobalScope"));
});

Deno.test("Test DelayNode exists", () => {
  assert(globalKeys.has("DelayNode"));
});

Deno.test("Test DeviceMotionEvent exists", () => {
  assert(globalKeys.has("DeviceMotionEvent"));
});

Deno.test("Test DeviceOrientationEvent exists", () => {
  assert(globalKeys.has("DeviceOrientationEvent"));
});

Deno.test("Test Document exists", () => {
  assert(globalKeys.has("Document"));
});

Deno.test("Test DocumentFragment exists", () => {
  assert(globalKeys.has("DocumentFragment"));
});

Deno.test("Test DocumentTimeline exists", () => {
  assert(globalKeys.has("DocumentTimeline"));
});

Deno.test("Test DocumentType exists", () => {
  assert(globalKeys.has("DocumentType"));
});

Deno.test("Test DOMException exists", () => {
  assert(globalKeys.has("DOMException"));
});

Deno.test("Test DOMImplementation exists", () => {
  assert(globalKeys.has("DOMImplementation"));
});

Deno.test("Test DOMMatrix exists", () => {
  assert(globalKeys.has("DOMMatrix"));
});

Deno.test("Test DOMMatrixReadOnly exists", () => {
  assert(globalKeys.has("DOMMatrixReadOnly"));
});

Deno.test("Test DOMParser exists", () => {
  assert(globalKeys.has("DOMParser"));
});

Deno.test("Test DOMPoint exists", () => {
  assert(globalKeys.has("DOMPoint"));
});

Deno.test("Test DOMPointReadOnly exists", () => {
  assert(globalKeys.has("DOMPointReadOnly"));
});

Deno.test("Test DOMQuad exists", () => {
  assert(globalKeys.has("DOMQuad"));
});

Deno.test("Test DOMRect exists", () => {
  assert(globalKeys.has("DOMRect"));
});

Deno.test("Test DOMRectReadOnly exists", () => {
  assert(globalKeys.has("DOMRectReadOnly"));
});

Deno.test("Test DOMStringList exists", () => {
  assert(globalKeys.has("DOMStringList"));
});

Deno.test("Test DOMStringMap exists", () => {
  assert(globalKeys.has("DOMStringMap"));
});

Deno.test("Test DOMTokenList exists", () => {
  assert(globalKeys.has("DOMTokenList"));
});

Deno.test("Test DragEvent exists", () => {
  assert(globalKeys.has("DragEvent"));
});

Deno.test("Test DynamicsCompressorNode exists", () => {
  assert(globalKeys.has("DynamicsCompressorNode"));
});

Deno.test("Test Element exists", () => {
  assert(globalKeys.has("Element"));
});

Deno.test("Test ElementInternals exists", () => {
  assert(globalKeys.has("ElementInternals"));
});

Deno.test("Test EncodedAudioChunk exists", () => {
  assert(globalKeys.has("EncodedAudioChunk"));
});

Deno.test("Test EncodedVideoChunk exists", () => {
  assert(globalKeys.has("EncodedVideoChunk"));
});

Deno.test("Test Error exists", () => {
  assert(globalKeys.has("Error"));
});

Deno.test("Test ErrorEvent exists", () => {
  assert(globalKeys.has("ErrorEvent"));
});

Deno.test("Test EvalError exists", () => {
  assert(globalKeys.has("EvalError"));
});

Deno.test("Test Event exists", () => {
  assert(globalKeys.has("Event"));
});

Deno.test("Test EventCounts exists", () => {
  assert(globalKeys.has("EventCounts"));
});

Deno.test("Test EventSource exists", () => {
  assert(globalKeys.has("EventSource"));
});

Deno.test("Test EventTarget exists", () => {
  assert(globalKeys.has("EventTarget"));
});

Deno.test("Test ExtendableEvent exists", () => {
  assert(globalKeys.has("ExtendableEvent"));
});

Deno.test("Test ExtendableMessageEvent exists", () => {
  assert(globalKeys.has("ExtendableMessageEvent"));
});

Deno.test("Test FetchEvent exists", () => {
  assert(globalKeys.has("FetchEvent"));
});

Deno.test("Test File exists", () => {
  assert(globalKeys.has("File"));
});

Deno.test("Test FileList exists", () => {
  assert(globalKeys.has("FileList"));
});

Deno.test("Test FileReader exists", () => {
  assert(globalKeys.has("FileReader"));
});

Deno.test("Test FileReaderSync exists", () => {
  assert(globalKeys.has("FileReaderSync"));
});

Deno.test("Test FileSystem exists", () => {
  assert(globalKeys.has("FileSystem"));
});

Deno.test("Test FileSystemDirectoryEntry exists", () => {
  assert(globalKeys.has("FileSystemDirectoryEntry"));
});

Deno.test("Test FileSystemDirectoryHandle exists", () => {
  assert(globalKeys.has("FileSystemDirectoryHandle"));
});

Deno.test("Test FileSystemDirectoryReader exists", () => {
  assert(globalKeys.has("FileSystemDirectoryReader"));
});

Deno.test("Test FileSystemEntry exists", () => {
  assert(globalKeys.has("FileSystemEntry"));
});

Deno.test("Test FileSystemFileEntry exists", () => {
  assert(globalKeys.has("FileSystemFileEntry"));
});

Deno.test("Test FileSystemFileHandle exists", () => {
  assert(globalKeys.has("FileSystemFileHandle"));
});

Deno.test("Test FileSystemHandle exists", () => {
  assert(globalKeys.has("FileSystemHandle"));
});

Deno.test("Test FileSystemSyncAccessHandle exists", () => {
  assert(globalKeys.has("FileSystemSyncAccessHandle"));
});

Deno.test("Test FileSystemWritableFileStream exists", () => {
  assert(globalKeys.has("FileSystemWritableFileStream"));
});

Deno.test("Test FinalizationRegistry exists", () => {
  assert(globalKeys.has("FinalizationRegistry"));
});

Deno.test("Test Float32Array exists", () => {
  assert(globalKeys.has("Float32Array"));
});

Deno.test("Test Float64Array exists", () => {
  assert(globalKeys.has("Float64Array"));
});

Deno.test("Test FocusEvent exists", () => {
  assert(globalKeys.has("FocusEvent"));
});

Deno.test("Test FontFace exists", () => {
  assert(globalKeys.has("FontFace"));
});

Deno.test("Test FontFaceSet exists", () => {
  assert(globalKeys.has("FontFaceSet"));
});

Deno.test("Test FontFaceSetLoadEvent exists", () => {
  assert(globalKeys.has("FontFaceSetLoadEvent"));
});

Deno.test("Test FormData exists", () => {
  assert(globalKeys.has("FormData"));
});

Deno.test("Test FormDataEvent exists", () => {
  assert(globalKeys.has("FormDataEvent"));
});

Deno.test("Test FragmentDirective exists", () => {
  assert(globalKeys.has("FragmentDirective"));
});

Deno.test("Test Function exists", () => {
  assert(globalKeys.has("Function"));
});

Deno.test("Test GainNode exists", () => {
  assert(globalKeys.has("GainNode"));
});

Deno.test("Test Gamepad exists", () => {
  assert(globalKeys.has("Gamepad"));
});

Deno.test("Test GamepadButton exists", () => {
  assert(globalKeys.has("GamepadButton"));
});

Deno.test("Test GamepadEvent exists", () => {
  assert(globalKeys.has("GamepadEvent"));
});

Deno.test("Test GamepadHapticActuator exists", () => {
  assert(globalKeys.has("GamepadHapticActuator"));
});

Deno.test("Test Geolocation exists", () => {
  assert(globalKeys.has("Geolocation"));
});

Deno.test("Test GeolocationCoordinates exists", () => {
  assert(globalKeys.has("GeolocationCoordinates"));
});

Deno.test("Test GeolocationPosition exists", () => {
  assert(globalKeys.has("GeolocationPosition"));
});

Deno.test("Test GeolocationPositionError exists", () => {
  assert(globalKeys.has("GeolocationPositionError"));
});

Deno.test("Test HashChangeEvent exists", () => {
  assert(globalKeys.has("HashChangeEvent"));
});

Deno.test("Test Headers exists", () => {
  assert(globalKeys.has("Headers"));
});

Deno.test("Test Highlight exists", () => {
  assert(globalKeys.has("Highlight"));
});

Deno.test("Test HighlightRegistry exists", () => {
  assert(globalKeys.has("HighlightRegistry"));
});

Deno.test("Test History exists", () => {
  assert(globalKeys.has("History"));
});

Deno.test("Test HTMLAllCollection exists", () => {
  assert(globalKeys.has("HTMLAllCollection"));
});

Deno.test("Test HTMLAnchorElement exists", () => {
  assert(globalKeys.has("HTMLAnchorElement"));
});

Deno.test("Test HTMLAreaElement exists", () => {
  assert(globalKeys.has("HTMLAreaElement"));
});

Deno.test("Test HTMLAudioElement exists", () => {
  assert(globalKeys.has("HTMLAudioElement"));
});

Deno.test("Test HTMLBaseElement exists", () => {
  assert(globalKeys.has("HTMLBaseElement"));
});

Deno.test("Test HTMLBodyElement exists", () => {
  assert(globalKeys.has("HTMLBodyElement"));
});

Deno.test("Test HTMLBRElement exists", () => {
  assert(globalKeys.has("HTMLBRElement"));
});

Deno.test("Test HTMLButtonElement exists", () => {
  assert(globalKeys.has("HTMLButtonElement"));
});

Deno.test("Test HTMLCanvasElement exists", () => {
  assert(globalKeys.has("HTMLCanvasElement"));
});

Deno.test("Test HTMLCollection exists", () => {
  assert(globalKeys.has("HTMLCollection"));
});

Deno.test("Test HTMLDataElement exists", () => {
  assert(globalKeys.has("HTMLDataElement"));
});

Deno.test("Test HTMLDataListElement exists", () => {
  assert(globalKeys.has("HTMLDataListElement"));
});

Deno.test("Test HTMLDetailsElement exists", () => {
  assert(globalKeys.has("HTMLDetailsElement"));
});

Deno.test("Test HTMLDialogElement exists", () => {
  assert(globalKeys.has("HTMLDialogElement"));
});

Deno.test("Test HTMLDivElement exists", () => {
  assert(globalKeys.has("HTMLDivElement"));
});

Deno.test("Test HTMLDListElement exists", () => {
  assert(globalKeys.has("HTMLDListElement"));
});

Deno.test("Test HTMLDocument exists", () => {
  assert(globalKeys.has("HTMLDocument"));
});

Deno.test("Test HTMLElement exists", () => {
  assert(globalKeys.has("HTMLElement"));
});

Deno.test("Test HTMLEmbedElement exists", () => {
  assert(globalKeys.has("HTMLEmbedElement"));
});

Deno.test("Test HTMLFieldSetElement exists", () => {
  assert(globalKeys.has("HTMLFieldSetElement"));
});

Deno.test("Test HTMLFontElement exists", () => {
  assert(globalKeys.has("HTMLFontElement"));
});

Deno.test("Test HTMLFormControlsCollection exists", () => {
  assert(globalKeys.has("HTMLFormControlsCollection"));
});

Deno.test("Test HTMLFormElement exists", () => {
  assert(globalKeys.has("HTMLFormElement"));
});

Deno.test("Test HTMLFrameSetElement exists", () => {
  assert(globalKeys.has("HTMLFrameSetElement"));
});

Deno.test("Test HTMLHeadElement exists", () => {
  assert(globalKeys.has("HTMLHeadElement"));
});

Deno.test("Test HTMLHeadingElement exists", () => {
  assert(globalKeys.has("HTMLHeadingElement"));
});

Deno.test("Test HTMLHRElement exists", () => {
  assert(globalKeys.has("HTMLHRElement"));
});

Deno.test("Test HTMLHtmlElement exists", () => {
  assert(globalKeys.has("HTMLHtmlElement"));
});

Deno.test("Test HTMLIFrameElement exists", () => {
  assert(globalKeys.has("HTMLIFrameElement"));
});

Deno.test("Test HTMLImageElement exists", () => {
  assert(globalKeys.has("HTMLImageElement"));
});

Deno.test("Test HTMLInputElement exists", () => {
  assert(globalKeys.has("HTMLInputElement"));
});

Deno.test("Test HTMLLabelElement exists", () => {
  assert(globalKeys.has("HTMLLabelElement"));
});

Deno.test("Test HTMLLegendElement exists", () => {
  assert(globalKeys.has("HTMLLegendElement"));
});

Deno.test("Test HTMLLIElement exists", () => {
  assert(globalKeys.has("HTMLLIElement"));
});

Deno.test("Test HTMLLinkElement exists", () => {
  assert(globalKeys.has("HTMLLinkElement"));
});

Deno.test("Test HTMLMapElement exists", () => {
  assert(globalKeys.has("HTMLMapElement"));
});

Deno.test("Test HTMLMarqueeElement exists", () => {
  assert(globalKeys.has("HTMLMarqueeElement"));
});

Deno.test("Test HTMLMediaElement exists", () => {
  assert(globalKeys.has("HTMLMediaElement"));
});

Deno.test("Test HTMLMenuElement exists", () => {
  assert(globalKeys.has("HTMLMenuElement"));
});

Deno.test("Test HTMLMetaElement exists", () => {
  assert(globalKeys.has("HTMLMetaElement"));
});

Deno.test("Test HTMLMeterElement exists", () => {
  assert(globalKeys.has("HTMLMeterElement"));
});

Deno.test("Test HTMLModElement exists", () => {
  assert(globalKeys.has("HTMLModElement"));
});

Deno.test("Test HTMLObjectElement exists", () => {
  assert(globalKeys.has("HTMLObjectElement"));
});

Deno.test("Test HTMLOListElement exists", () => {
  assert(globalKeys.has("HTMLOListElement"));
});

Deno.test("Test HTMLOptGroupElement exists", () => {
  assert(globalKeys.has("HTMLOptGroupElement"));
});

Deno.test("Test HTMLOptionElement exists", () => {
  assert(globalKeys.has("HTMLOptionElement"));
});

Deno.test("Test HTMLOptionsCollection exists", () => {
  assert(globalKeys.has("HTMLOptionsCollection"));
});

Deno.test("Test HTMLOutputElement exists", () => {
  assert(globalKeys.has("HTMLOutputElement"));
});

Deno.test("Test HTMLParagraphElement exists", () => {
  assert(globalKeys.has("HTMLParagraphElement"));
});

Deno.test("Test HTMLParamElement exists", () => {
  assert(globalKeys.has("HTMLParamElement"));
});

Deno.test("Test HTMLPictureElement exists", () => {
  assert(globalKeys.has("HTMLPictureElement"));
});

Deno.test("Test HTMLPreElement exists", () => {
  assert(globalKeys.has("HTMLPreElement"));
});

Deno.test("Test HTMLProgressElement exists", () => {
  assert(globalKeys.has("HTMLProgressElement"));
});

Deno.test("Test HTMLQuoteElement exists", () => {
  assert(globalKeys.has("HTMLQuoteElement"));
});

Deno.test("Test HTMLScriptElement exists", () => {
  assert(globalKeys.has("HTMLScriptElement"));
});

Deno.test("Test HTMLSelectElement exists", () => {
  assert(globalKeys.has("HTMLSelectElement"));
});

Deno.test("Test HTMLSlotElement exists", () => {
  assert(globalKeys.has("HTMLSlotElement"));
});

Deno.test("Test HTMLSourceElement exists", () => {
  assert(globalKeys.has("HTMLSourceElement"));
});

Deno.test("Test HTMLSpanElement exists", () => {
  assert(globalKeys.has("HTMLSpanElement"));
});

Deno.test("Test HTMLStyleElement exists", () => {
  assert(globalKeys.has("HTMLStyleElement"));
});

Deno.test("Test HTMLTableCaptionElement exists", () => {
  assert(globalKeys.has("HTMLTableCaptionElement"));
});

Deno.test("Test HTMLTableCellElement exists", () => {
  assert(globalKeys.has("HTMLTableCellElement"));
});

Deno.test("Test HTMLTableColElement exists", () => {
  assert(globalKeys.has("HTMLTableColElement"));
});

Deno.test("Test HTMLTableElement exists", () => {
  assert(globalKeys.has("HTMLTableElement"));
});

Deno.test("Test HTMLTableRowElement exists", () => {
  assert(globalKeys.has("HTMLTableRowElement"));
});

Deno.test("Test HTMLTableSectionElement exists", () => {
  assert(globalKeys.has("HTMLTableSectionElement"));
});

Deno.test("Test HTMLTemplateElement exists", () => {
  assert(globalKeys.has("HTMLTemplateElement"));
});

Deno.test("Test HTMLTextAreaElement exists", () => {
  assert(globalKeys.has("HTMLTextAreaElement"));
});

Deno.test("Test HTMLTimeElement exists", () => {
  assert(globalKeys.has("HTMLTimeElement"));
});

Deno.test("Test HTMLTitleElement exists", () => {
  assert(globalKeys.has("HTMLTitleElement"));
});

Deno.test("Test HTMLTrackElement exists", () => {
  assert(globalKeys.has("HTMLTrackElement"));
});

Deno.test("Test HTMLUListElement exists", () => {
  assert(globalKeys.has("HTMLUListElement"));
});

Deno.test("Test HTMLUnknownElement exists", () => {
  assert(globalKeys.has("HTMLUnknownElement"));
});

Deno.test("Test HTMLVideoElement exists", () => {
  assert(globalKeys.has("HTMLVideoElement"));
});

Deno.test("Test IDBCursor exists", () => {
  assert(globalKeys.has("IDBCursor"));
});

Deno.test("Test IDBCursorWithValue exists", () => {
  assert(globalKeys.has("IDBCursorWithValue"));
});

Deno.test("Test IDBDatabase exists", () => {
  assert(globalKeys.has("IDBDatabase"));
});

Deno.test("Test IDBFactory exists", () => {
  assert(globalKeys.has("IDBFactory"));
});

Deno.test("Test IDBIndex exists", () => {
  assert(globalKeys.has("IDBIndex"));
});

Deno.test("Test IDBKeyRange exists", () => {
  assert(globalKeys.has("IDBKeyRange"));
});

Deno.test("Test IDBObjectStore exists", () => {
  assert(globalKeys.has("IDBObjectStore"));
});

Deno.test("Test IDBOpenDBRequest exists", () => {
  assert(globalKeys.has("IDBOpenDBRequest"));
});

Deno.test("Test IDBRequest exists", () => {
  assert(globalKeys.has("IDBRequest"));
});

Deno.test("Test IDBTransaction exists", () => {
  assert(globalKeys.has("IDBTransaction"));
});

Deno.test("Test IDBVersionChangeEvent exists", () => {
  assert(globalKeys.has("IDBVersionChangeEvent"));
});

Deno.test("Test IdleDeadline exists", () => {
  assert(globalKeys.has("IdleDeadline"));
});

Deno.test("Test IIRFilterNode exists", () => {
  assert(globalKeys.has("IIRFilterNode"));
});

Deno.test("Test ImageBitmap exists", () => {
  assert(globalKeys.has("ImageBitmap"));
});

Deno.test("Test ImageBitmapRenderingContext exists", () => {
  assert(globalKeys.has("ImageBitmapRenderingContext"));
});

Deno.test("Test ImageData exists", () => {
  assert(globalKeys.has("ImageData"));
});

Deno.test("Test Infinity exists", () => {
  assert(globalKeys.has("Infinity"));
});

Deno.test("Test InputDeviceInfo exists", () => {
  assert(globalKeys.has("InputDeviceInfo"));
});

Deno.test("Test InputEvent exists", () => {
  assert(globalKeys.has("InputEvent"));
});

Deno.test("Test Int16Array exists", () => {
  assert(globalKeys.has("Int16Array"));
});

Deno.test("Test Int32Array exists", () => {
  assert(globalKeys.has("Int32Array"));
});

Deno.test("Test Int8Array exists", () => {
  assert(globalKeys.has("Int8Array"));
});

Deno.test("Test IntersectionObserver exists", () => {
  assert(globalKeys.has("IntersectionObserver"));
});

Deno.test("Test IntersectionObserverEntry exists", () => {
  assert(globalKeys.has("IntersectionObserverEntry"));
});

Deno.test("Test Intl exists", () => {
  assert(globalKeys.has("Intl"));
});

Deno.test("Test Iterator exists", () => {
  assert(globalKeys.has("Iterator"));
});

Deno.test("Test JSON exists", () => {
  assert(globalKeys.has("JSON"));
});

Deno.test("Test KeyboardEvent exists", () => {
  assert(globalKeys.has("KeyboardEvent"));
});

Deno.test("Test KeyframeEffect exists", () => {
  assert(globalKeys.has("KeyframeEffect"));
});

Deno.test("Test LargestContentfulPaint exists", () => {
  assert(globalKeys.has("LargestContentfulPaint"));
});

Deno.test("Test Location exists", () => {
  assert(globalKeys.has("Location"));
});

Deno.test("Test Lock exists", () => {
  assert(globalKeys.has("Lock"));
});

Deno.test("Test LockManager exists", () => {
  assert(globalKeys.has("LockManager"));
});

Deno.test("Test Map exists", () => {
  assert(globalKeys.has("Map"));
});

Deno.test("Test Math exists", () => {
  assert(globalKeys.has("Math"));
});

Deno.test("Test MathMLElement exists", () => {
  assert(globalKeys.has("MathMLElement"));
});

Deno.test("Test MediaCapabilities exists", () => {
  assert(globalKeys.has("MediaCapabilities"));
});

Deno.test("Test MediaDeviceInfo exists", () => {
  assert(globalKeys.has("MediaDeviceInfo"));
});

Deno.test("Test MediaDevices exists", () => {
  assert(globalKeys.has("MediaDevices"));
});

Deno.test("Test MediaElementAudioSourceNode exists", () => {
  assert(globalKeys.has("MediaElementAudioSourceNode"));
});

Deno.test("Test MediaEncryptedEvent exists", () => {
  assert(globalKeys.has("MediaEncryptedEvent"));
});

Deno.test("Test MediaError exists", () => {
  assert(globalKeys.has("MediaError"));
});

Deno.test("Test MediaKeyMessageEvent exists", () => {
  assert(globalKeys.has("MediaKeyMessageEvent"));
});

Deno.test("Test MediaKeys exists", () => {
  assert(globalKeys.has("MediaKeys"));
});

Deno.test("Test MediaKeySession exists", () => {
  assert(globalKeys.has("MediaKeySession"));
});

Deno.test("Test MediaKeyStatusMap exists", () => {
  assert(globalKeys.has("MediaKeyStatusMap"));
});

Deno.test("Test MediaKeySystemAccess exists", () => {
  assert(globalKeys.has("MediaKeySystemAccess"));
});

Deno.test("Test MediaList exists", () => {
  assert(globalKeys.has("MediaList"));
});

Deno.test("Test MediaMetadata exists", () => {
  assert(globalKeys.has("MediaMetadata"));
});

Deno.test("Test MediaQueryList exists", () => {
  assert(globalKeys.has("MediaQueryList"));
});

Deno.test("Test MediaQueryListEvent exists", () => {
  assert(globalKeys.has("MediaQueryListEvent"));
});

Deno.test("Test MediaRecorder exists", () => {
  assert(globalKeys.has("MediaRecorder"));
});

Deno.test("Test MediaSession exists", () => {
  assert(globalKeys.has("MediaSession"));
});

Deno.test("Test MediaSource exists", () => {
  assert(globalKeys.has("MediaSource"));
});

Deno.test("Test MediaSourceHandle exists", () => {
  assert(globalKeys.has("MediaSourceHandle"));
});

Deno.test("Test MediaStream exists", () => {
  assert(globalKeys.has("MediaStream"));
});

Deno.test("Test MediaStreamAudioDestinationNode exists", () => {
  assert(globalKeys.has("MediaStreamAudioDestinationNode"));
});

Deno.test("Test MediaStreamAudioSourceNode exists", () => {
  assert(globalKeys.has("MediaStreamAudioSourceNode"));
});

Deno.test("Test MediaStreamTrack exists", () => {
  assert(globalKeys.has("MediaStreamTrack"));
});

Deno.test("Test MediaStreamTrackEvent exists", () => {
  assert(globalKeys.has("MediaStreamTrackEvent"));
});

Deno.test("Test MediaStreamTrackProcessor exists", () => {
  assert(globalKeys.has("MediaStreamTrackProcessor"));
});

Deno.test("Test MessageChannel exists", () => {
  assert(globalKeys.has("MessageChannel"));
});

Deno.test("Test MessageEvent exists", () => {
  assert(globalKeys.has("MessageEvent"));
});

Deno.test("Test MessagePort exists", () => {
  assert(globalKeys.has("MessagePort"));
});

Deno.test("Test MIDIAccess exists", () => {
  assert(globalKeys.has("MIDIAccess"));
});

Deno.test("Test MIDIConnectionEvent exists", () => {
  assert(globalKeys.has("MIDIConnectionEvent"));
});

Deno.test("Test MIDIInput exists", () => {
  assert(globalKeys.has("MIDIInput"));
});

Deno.test("Test MIDIInputMap exists", () => {
  assert(globalKeys.has("MIDIInputMap"));
});

Deno.test("Test MIDIMessageEvent exists", () => {
  assert(globalKeys.has("MIDIMessageEvent"));
});

Deno.test("Test MIDIOutput exists", () => {
  assert(globalKeys.has("MIDIOutput"));
});

Deno.test("Test MIDIOutputMap exists", () => {
  assert(globalKeys.has("MIDIOutputMap"));
});

Deno.test("Test MIDIPort exists", () => {
  assert(globalKeys.has("MIDIPort"));
});

Deno.test("Test MimeType exists", () => {
  assert(globalKeys.has("MimeType"));
});

Deno.test("Test MimeTypeArray exists", () => {
  assert(globalKeys.has("MimeTypeArray"));
});

Deno.test("Test MouseEvent exists", () => {
  assert(globalKeys.has("MouseEvent"));
});

Deno.test("Test MutationObserver exists", () => {
  assert(globalKeys.has("MutationObserver"));
});

Deno.test("Test MutationRecord exists", () => {
  assert(globalKeys.has("MutationRecord"));
});

Deno.test("Test NamedNodeMap exists", () => {
  assert(globalKeys.has("NamedNodeMap"));
});

Deno.test("Test NaN exists", () => {
  assert(globalKeys.has("NaN"));
});

Deno.test("Test NavigationPreloadManager exists", () => {
  assert(globalKeys.has("NavigationPreloadManager"));
});

Deno.test("Test Navigator exists", () => {
  assert(globalKeys.has("Navigator"));
});

Deno.test("Test Node exists", () => {
  assert(globalKeys.has("Node"));
});

Deno.test("Test NodeIterator exists", () => {
  assert(globalKeys.has("NodeIterator"));
});

Deno.test("Test NodeList exists", () => {
  assert(globalKeys.has("NodeList"));
});

Deno.test("Test Notification exists", () => {
  assert(globalKeys.has("Notification"));
});

Deno.test("Test NotificationEvent exists", () => {
  assert(globalKeys.has("NotificationEvent"));
});

Deno.test("Test Number exists", () => {
  assert(globalKeys.has("Number"));
});

Deno.test("Test Object exists", () => {
  assert(globalKeys.has("Object"));
});

Deno.test("Test OfflineAudioCompletionEvent exists", () => {
  assert(globalKeys.has("OfflineAudioCompletionEvent"));
});

Deno.test("Test OfflineAudioContext exists", () => {
  assert(globalKeys.has("OfflineAudioContext"));
});

Deno.test("Test OffscreenCanvas exists", () => {
  assert(globalKeys.has("OffscreenCanvas"));
});

Deno.test("Test OffscreenCanvasRenderingContext2D exists", () => {
  assert(globalKeys.has("OffscreenCanvasRenderingContext2D"));
});

Deno.test("Test OscillatorNode exists", () => {
  assert(globalKeys.has("OscillatorNode"));
});

Deno.test("Test OverconstrainedError exists", () => {
  assert(globalKeys.has("OverconstrainedError"));
});

Deno.test("Test PageTransitionEvent exists", () => {
  assert(globalKeys.has("PageTransitionEvent"));
});

Deno.test("Test PannerNode exists", () => {
  assert(globalKeys.has("PannerNode"));
});

Deno.test("Test Path2D exists", () => {
  assert(globalKeys.has("Path2D"));
});

Deno.test("Test PaymentAddress exists", () => {
  assert(globalKeys.has("PaymentAddress"));
});

Deno.test("Test PaymentMethodChangeEvent exists", () => {
  assert(globalKeys.has("PaymentMethodChangeEvent"));
});

Deno.test("Test PaymentRequest exists", () => {
  assert(globalKeys.has("PaymentRequest"));
});

Deno.test("Test PaymentRequestUpdateEvent exists", () => {
  assert(globalKeys.has("PaymentRequestUpdateEvent"));
});

Deno.test("Test PaymentResponse exists", () => {
  assert(globalKeys.has("PaymentResponse"));
});

Deno.test("Test Performance exists", () => {
  assert(globalKeys.has("Performance"));
});

Deno.test("Test PerformanceEntry exists", () => {
  assert(globalKeys.has("PerformanceEntry"));
});

Deno.test("Test PerformanceEventTiming exists", () => {
  assert(globalKeys.has("PerformanceEventTiming"));
});

Deno.test("Test PerformanceMark exists", () => {
  assert(globalKeys.has("PerformanceMark"));
});

Deno.test("Test PerformanceMeasure exists", () => {
  assert(globalKeys.has("PerformanceMeasure"));
});

Deno.test("Test PerformanceNavigation exists", () => {
  assert(globalKeys.has("PerformanceNavigation"));
});

Deno.test("Test PerformanceNavigationTiming exists", () => {
  assert(globalKeys.has("PerformanceNavigationTiming"));
});

Deno.test("Test PerformanceObserver exists", () => {
  assert(globalKeys.has("PerformanceObserver"));
});

Deno.test("Test PerformanceObserverEntryList exists", () => {
  assert(globalKeys.has("PerformanceObserverEntryList"));
});

Deno.test("Test PerformancePaintTiming exists", () => {
  assert(globalKeys.has("PerformancePaintTiming"));
});

Deno.test("Test PerformanceResourceTiming exists", () => {
  assert(globalKeys.has("PerformanceResourceTiming"));
});

Deno.test("Test PerformanceServerTiming exists", () => {
  assert(globalKeys.has("PerformanceServerTiming"));
});

Deno.test("Test PerformanceTiming exists", () => {
  assert(globalKeys.has("PerformanceTiming"));
});

Deno.test("Test PeriodicWave exists", () => {
  assert(globalKeys.has("PeriodicWave"));
});

Deno.test("Test Permissions exists", () => {
  assert(globalKeys.has("Permissions"));
});

Deno.test("Test PermissionStatus exists", () => {
  assert(globalKeys.has("PermissionStatus"));
});

Deno.test("Test PictureInPictureEvent exists", () => {
  assert(globalKeys.has("PictureInPictureEvent"));
});

Deno.test("Test PictureInPictureWindow exists", () => {
  assert(globalKeys.has("PictureInPictureWindow"));
});

Deno.test("Test Plugin exists", () => {
  assert(globalKeys.has("Plugin"));
});

Deno.test("Test PluginArray exists", () => {
  assert(globalKeys.has("PluginArray"));
});

Deno.test("Test PointerEvent exists", () => {
  assert(globalKeys.has("PointerEvent"));
});

Deno.test("Test PopStateEvent exists", () => {
  assert(globalKeys.has("PopStateEvent"));
});

Deno.test("Test ProcessingInstruction exists", () => {
  assert(globalKeys.has("ProcessingInstruction"));
});

Deno.test("Test ProgressEvent exists", () => {
  assert(globalKeys.has("ProgressEvent"));
});

Deno.test("Test Promise exists", () => {
  assert(globalKeys.has("Promise"));
});

Deno.test("Test PromiseRejectionEvent exists", () => {
  assert(globalKeys.has("PromiseRejectionEvent"));
});

Deno.test("Test Proxy exists", () => {
  assert(globalKeys.has("Proxy"));
});

Deno.test("Test PublicKeyCredential exists", () => {
  assert(globalKeys.has("PublicKeyCredential"));
});

Deno.test("Test PushEvent exists", () => {
  assert(globalKeys.has("PushEvent"));
});

Deno.test("Test PushManager exists", () => {
  assert(globalKeys.has("PushManager"));
});

Deno.test("Test PushMessageData exists", () => {
  assert(globalKeys.has("PushMessageData"));
});

Deno.test("Test PushSubscription exists", () => {
  assert(globalKeys.has("PushSubscription"));
});

Deno.test("Test PushSubscriptionOptions exists", () => {
  assert(globalKeys.has("PushSubscriptionOptions"));
});

Deno.test("Test RadioNodeList exists", () => {
  assert(globalKeys.has("RadioNodeList"));
});

Deno.test("Test Range exists", () => {
  assert(globalKeys.has("Range"));
});

Deno.test("Test RangeError exists", () => {
  assert(globalKeys.has("RangeError"));
});

Deno.test("Test ReadableByteStreamController exists", () => {
  assert(globalKeys.has("ReadableByteStreamController"));
});

Deno.test("Test ReadableStream exists", () => {
  assert(globalKeys.has("ReadableStream"));
});

Deno.test("Test ReadableStreamBYOBReader exists", () => {
  assert(globalKeys.has("ReadableStreamBYOBReader"));
});

Deno.test("Test ReadableStreamBYOBRequest exists", () => {
  assert(globalKeys.has("ReadableStreamBYOBRequest"));
});

Deno.test("Test ReadableStreamDefaultController exists", () => {
  assert(globalKeys.has("ReadableStreamDefaultController"));
});

Deno.test("Test ReadableStreamDefaultReader exists", () => {
  assert(globalKeys.has("ReadableStreamDefaultReader"));
});

Deno.test("Test ReferenceError exists", () => {
  assert(globalKeys.has("ReferenceError"));
});

Deno.test("Test Reflect exists", () => {
  assert(globalKeys.has("Reflect"));
});

Deno.test("Test RegExp exists", () => {
  assert(globalKeys.has("RegExp"));
});

Deno.test("Test RemotePlayback exists", () => {
  assert(globalKeys.has("RemotePlayback"));
});

Deno.test("Test Report exists", () => {
  assert(globalKeys.has("Report"));
});

Deno.test("Test ReportBody exists", () => {
  assert(globalKeys.has("ReportBody"));
});

Deno.test("Test ReportingObserver exists", () => {
  assert(globalKeys.has("ReportingObserver"));
});

Deno.test("Test Request exists", () => {
  assert(globalKeys.has("Request"));
});

Deno.test("Test ResizeObserver exists", () => {
  assert(globalKeys.has("ResizeObserver"));
});

Deno.test("Test ResizeObserverEntry exists", () => {
  assert(globalKeys.has("ResizeObserverEntry"));
});

Deno.test("Test ResizeObserverSize exists", () => {
  assert(globalKeys.has("ResizeObserverSize"));
});

Deno.test("Test Response exists", () => {
  assert(globalKeys.has("Response"));
});

Deno.test("Test RTCCertificate exists", () => {
  assert(globalKeys.has("RTCCertificate"));
});

Deno.test("Test RTCDataChannel exists", () => {
  assert(globalKeys.has("RTCDataChannel"));
});

Deno.test("Test RTCDataChannelEvent exists", () => {
  assert(globalKeys.has("RTCDataChannelEvent"));
});

Deno.test("Test RTCDtlsTransport exists", () => {
  assert(globalKeys.has("RTCDtlsTransport"));
});

Deno.test("Test RTCDTMFSender exists", () => {
  assert(globalKeys.has("RTCDTMFSender"));
});

Deno.test("Test RTCDTMFToneChangeEvent exists", () => {
  assert(globalKeys.has("RTCDTMFToneChangeEvent"));
});

Deno.test("Test RTCEncodedAudioFrame exists", () => {
  assert(globalKeys.has("RTCEncodedAudioFrame"));
});

Deno.test("Test RTCEncodedVideoFrame exists", () => {
  assert(globalKeys.has("RTCEncodedVideoFrame"));
});

Deno.test("Test RTCError exists", () => {
  assert(globalKeys.has("RTCError"));
});

Deno.test("Test RTCErrorEvent exists", () => {
  assert(globalKeys.has("RTCErrorEvent"));
});

Deno.test("Test RTCIceCandidate exists", () => {
  assert(globalKeys.has("RTCIceCandidate"));
});

Deno.test("Test RTCIceTransport exists", () => {
  assert(globalKeys.has("RTCIceTransport"));
});

Deno.test("Test RTCPeerConnection exists", () => {
  assert(globalKeys.has("RTCPeerConnection"));
});

Deno.test("Test RTCPeerConnectionIceErrorEvent exists", () => {
  assert(globalKeys.has("RTCPeerConnectionIceErrorEvent"));
});

Deno.test("Test RTCPeerConnectionIceEvent exists", () => {
  assert(globalKeys.has("RTCPeerConnectionIceEvent"));
});

Deno.test("Test RTCRtpReceiver exists", () => {
  assert(globalKeys.has("RTCRtpReceiver"));
});

Deno.test("Test RTCRtpScriptTransform exists", () => {
  assert(globalKeys.has("RTCRtpScriptTransform"));
});

Deno.test("Test RTCRtpScriptTransformer exists", () => {
  assert(globalKeys.has("RTCRtpScriptTransformer"));
});

Deno.test("Test RTCRtpSender exists", () => {
  assert(globalKeys.has("RTCRtpSender"));
});

Deno.test("Test RTCRtpTransceiver exists", () => {
  assert(globalKeys.has("RTCRtpTransceiver"));
});

Deno.test("Test RTCSctpTransport exists", () => {
  assert(globalKeys.has("RTCSctpTransport"));
});

Deno.test("Test RTCSessionDescription exists", () => {
  assert(globalKeys.has("RTCSessionDescription"));
});

Deno.test("Test RTCStatsReport exists", () => {
  assert(globalKeys.has("RTCStatsReport"));
});

Deno.test("Test RTCTrackEvent exists", () => {
  assert(globalKeys.has("RTCTrackEvent"));
});

Deno.test("Test RTCTransformEvent exists", () => {
  assert(globalKeys.has("RTCTransformEvent"));
});

Deno.test("Test Screen exists", () => {
  assert(globalKeys.has("Screen"));
});

Deno.test("Test ScreenOrientation exists", () => {
  assert(globalKeys.has("ScreenOrientation"));
});

Deno.test("Test ScriptProcessorNode exists", () => {
  assert(globalKeys.has("ScriptProcessorNode"));
});

Deno.test("Test SecurityPolicyViolationEvent exists", () => {
  assert(globalKeys.has("SecurityPolicyViolationEvent"));
});

Deno.test("Test Selection exists", () => {
  assert(globalKeys.has("Selection"));
});

Deno.test("Test ServiceWorker exists", () => {
  assert(globalKeys.has("ServiceWorker"));
});

Deno.test("Test ServiceWorkerContainer exists", () => {
  assert(globalKeys.has("ServiceWorkerContainer"));
});

Deno.test("Test ServiceWorkerGlobalScope exists", () => {
  assert(globalKeys.has("ServiceWorkerGlobalScope"));
});

Deno.test("Test ServiceWorkerRegistration exists", () => {
  assert(globalKeys.has("ServiceWorkerRegistration"));
});

Deno.test("Test Set exists", () => {
  assert(globalKeys.has("Set"));
});

Deno.test("Test ShadowRoot exists", () => {
  assert(globalKeys.has("ShadowRoot"));
});

Deno.test("Test SharedArrayBuffer exists", () => {
  assert(globalKeys.has("SharedArrayBuffer"));
});

Deno.test("Test SharedWorker exists", () => {
  assert(globalKeys.has("SharedWorker"));
});

Deno.test("Test SharedWorkerGlobalScope exists", () => {
  assert(globalKeys.has("SharedWorkerGlobalScope"));
});

Deno.test("Test SourceBuffer exists", () => {
  assert(globalKeys.has("SourceBuffer"));
});

Deno.test("Test SourceBufferList exists", () => {
  assert(globalKeys.has("SourceBufferList"));
});

Deno.test("Test SpeechRecognitionAlternative exists", () => {
  assert(globalKeys.has("SpeechRecognitionAlternative"));
});

Deno.test("Test SpeechRecognitionResult exists", () => {
  assert(globalKeys.has("SpeechRecognitionResult"));
});

Deno.test("Test SpeechRecognitionResultList exists", () => {
  assert(globalKeys.has("SpeechRecognitionResultList"));
});

Deno.test("Test SpeechSynthesis exists", () => {
  assert(globalKeys.has("SpeechSynthesis"));
});

Deno.test("Test SpeechSynthesisErrorEvent exists", () => {
  assert(globalKeys.has("SpeechSynthesisErrorEvent"));
});

Deno.test("Test SpeechSynthesisEvent exists", () => {
  assert(globalKeys.has("SpeechSynthesisEvent"));
});

Deno.test("Test SpeechSynthesisUtterance exists", () => {
  assert(globalKeys.has("SpeechSynthesisUtterance"));
});

Deno.test("Test SpeechSynthesisVoice exists", () => {
  assert(globalKeys.has("SpeechSynthesisVoice"));
});

Deno.test("Test StaticRange exists", () => {
  assert(globalKeys.has("StaticRange"));
});

Deno.test("Test StereoPannerNode exists", () => {
  assert(globalKeys.has("StereoPannerNode"));
});

Deno.test("Test Storage exists", () => {
  assert(globalKeys.has("Storage"));
});

Deno.test("Test StorageEvent exists", () => {
  assert(globalKeys.has("StorageEvent"));
});

Deno.test("Test StorageManager exists", () => {
  assert(globalKeys.has("StorageManager"));
});

Deno.test("Test String exists", () => {
  assert(globalKeys.has("String"));
});

Deno.test("Test StylePropertyMap exists", () => {
  assert(globalKeys.has("StylePropertyMap"));
});

Deno.test("Test StylePropertyMapReadOnly exists", () => {
  assert(globalKeys.has("StylePropertyMapReadOnly"));
});

Deno.test("Test StyleSheet exists", () => {
  assert(globalKeys.has("StyleSheet"));
});

Deno.test("Test StyleSheetList exists", () => {
  assert(globalKeys.has("StyleSheetList"));
});

Deno.test("Test SubmitEvent exists", () => {
  assert(globalKeys.has("SubmitEvent"));
});

Deno.test("Test SubtleCrypto exists", () => {
  assert(globalKeys.has("SubtleCrypto"));
});

Deno.test("Test SVGAElement exists", () => {
  assert(globalKeys.has("SVGAElement"));
});

Deno.test("Test SVGAngle exists", () => {
  assert(globalKeys.has("SVGAngle"));
});

Deno.test("Test SVGAnimatedAngle exists", () => {
  assert(globalKeys.has("SVGAnimatedAngle"));
});

Deno.test("Test SVGAnimatedBoolean exists", () => {
  assert(globalKeys.has("SVGAnimatedBoolean"));
});

Deno.test("Test SVGAnimatedEnumeration exists", () => {
  assert(globalKeys.has("SVGAnimatedEnumeration"));
});

Deno.test("Test SVGAnimatedInteger exists", () => {
  assert(globalKeys.has("SVGAnimatedInteger"));
});

Deno.test("Test SVGAnimatedLength exists", () => {
  assert(globalKeys.has("SVGAnimatedLength"));
});

Deno.test("Test SVGAnimatedLengthList exists", () => {
  assert(globalKeys.has("SVGAnimatedLengthList"));
});

Deno.test("Test SVGAnimatedNumber exists", () => {
  assert(globalKeys.has("SVGAnimatedNumber"));
});

Deno.test("Test SVGAnimatedNumberList exists", () => {
  assert(globalKeys.has("SVGAnimatedNumberList"));
});

Deno.test("Test SVGAnimatedPreserveAspectRatio exists", () => {
  assert(globalKeys.has("SVGAnimatedPreserveAspectRatio"));
});

Deno.test("Test SVGAnimatedRect exists", () => {
  assert(globalKeys.has("SVGAnimatedRect"));
});

Deno.test("Test SVGAnimatedString exists", () => {
  assert(globalKeys.has("SVGAnimatedString"));
});

Deno.test("Test SVGAnimatedTransformList exists", () => {
  assert(globalKeys.has("SVGAnimatedTransformList"));
});

Deno.test("Test SVGAnimateElement exists", () => {
  assert(globalKeys.has("SVGAnimateElement"));
});

Deno.test("Test SVGAnimateMotionElement exists", () => {
  assert(globalKeys.has("SVGAnimateMotionElement"));
});

Deno.test("Test SVGAnimateTransformElement exists", () => {
  assert(globalKeys.has("SVGAnimateTransformElement"));
});

Deno.test("Test SVGAnimationElement exists", () => {
  assert(globalKeys.has("SVGAnimationElement"));
});

Deno.test("Test SVGCircleElement exists", () => {
  assert(globalKeys.has("SVGCircleElement"));
});

Deno.test("Test SVGClipPathElement exists", () => {
  assert(globalKeys.has("SVGClipPathElement"));
});

Deno.test("Test SVGComponentTransferFunctionElement exists", () => {
  assert(globalKeys.has("SVGComponentTransferFunctionElement"));
});

Deno.test("Test SVGDefsElement exists", () => {
  assert(globalKeys.has("SVGDefsElement"));
});

Deno.test("Test SVGDescElement exists", () => {
  assert(globalKeys.has("SVGDescElement"));
});

Deno.test("Test SVGElement exists", () => {
  assert(globalKeys.has("SVGElement"));
});

Deno.test("Test SVGEllipseElement exists", () => {
  assert(globalKeys.has("SVGEllipseElement"));
});

Deno.test("Test SVGFEBlendElement exists", () => {
  assert(globalKeys.has("SVGFEBlendElement"));
});

Deno.test("Test SVGFEColorMatrixElement exists", () => {
  assert(globalKeys.has("SVGFEColorMatrixElement"));
});

Deno.test("Test SVGFEComponentTransferElement exists", () => {
  assert(globalKeys.has("SVGFEComponentTransferElement"));
});

Deno.test("Test SVGFECompositeElement exists", () => {
  assert(globalKeys.has("SVGFECompositeElement"));
});

Deno.test("Test SVGFEConvolveMatrixElement exists", () => {
  assert(globalKeys.has("SVGFEConvolveMatrixElement"));
});

Deno.test("Test SVGFEDiffuseLightingElement exists", () => {
  assert(globalKeys.has("SVGFEDiffuseLightingElement"));
});

Deno.test("Test SVGFEDisplacementMapElement exists", () => {
  assert(globalKeys.has("SVGFEDisplacementMapElement"));
});

Deno.test("Test SVGFEDistantLightElement exists", () => {
  assert(globalKeys.has("SVGFEDistantLightElement"));
});

Deno.test("Test SVGFEDropShadowElement exists", () => {
  assert(globalKeys.has("SVGFEDropShadowElement"));
});

Deno.test("Test SVGFEFloodElement exists", () => {
  assert(globalKeys.has("SVGFEFloodElement"));
});

Deno.test("Test SVGFEFuncAElement exists", () => {
  assert(globalKeys.has("SVGFEFuncAElement"));
});

Deno.test("Test SVGFEFuncBElement exists", () => {
  assert(globalKeys.has("SVGFEFuncBElement"));
});

Deno.test("Test SVGFEFuncGElement exists", () => {
  assert(globalKeys.has("SVGFEFuncGElement"));
});

Deno.test("Test SVGFEFuncRElement exists", () => {
  assert(globalKeys.has("SVGFEFuncRElement"));
});

Deno.test("Test SVGFEGaussianBlurElement exists", () => {
  assert(globalKeys.has("SVGFEGaussianBlurElement"));
});

Deno.test("Test SVGFEImageElement exists", () => {
  assert(globalKeys.has("SVGFEImageElement"));
});

Deno.test("Test SVGFEMergeElement exists", () => {
  assert(globalKeys.has("SVGFEMergeElement"));
});

Deno.test("Test SVGFEMergeNodeElement exists", () => {
  assert(globalKeys.has("SVGFEMergeNodeElement"));
});

Deno.test("Test SVGFEMorphologyElement exists", () => {
  assert(globalKeys.has("SVGFEMorphologyElement"));
});

Deno.test("Test SVGFEOffsetElement exists", () => {
  assert(globalKeys.has("SVGFEOffsetElement"));
});

Deno.test("Test SVGFEPointLightElement exists", () => {
  assert(globalKeys.has("SVGFEPointLightElement"));
});

Deno.test("Test SVGFESpecularLightingElement exists", () => {
  assert(globalKeys.has("SVGFESpecularLightingElement"));
});

Deno.test("Test SVGFESpotLightElement exists", () => {
  assert(globalKeys.has("SVGFESpotLightElement"));
});

Deno.test("Test SVGFETileElement exists", () => {
  assert(globalKeys.has("SVGFETileElement"));
});

Deno.test("Test SVGFETurbulenceElement exists", () => {
  assert(globalKeys.has("SVGFETurbulenceElement"));
});

Deno.test("Test SVGFilterElement exists", () => {
  assert(globalKeys.has("SVGFilterElement"));
});

Deno.test("Test SVGForeignObjectElement exists", () => {
  assert(globalKeys.has("SVGForeignObjectElement"));
});

Deno.test("Test SVGGElement exists", () => {
  assert(globalKeys.has("SVGGElement"));
});

Deno.test("Test SVGGeometryElement exists", () => {
  assert(globalKeys.has("SVGGeometryElement"));
});

Deno.test("Test SVGGradientElement exists", () => {
  assert(globalKeys.has("SVGGradientElement"));
});

Deno.test("Test SVGGraphicsElement exists", () => {
  assert(globalKeys.has("SVGGraphicsElement"));
});

Deno.test("Test SVGImageElement exists", () => {
  assert(globalKeys.has("SVGImageElement"));
});

Deno.test("Test SVGLength exists", () => {
  assert(globalKeys.has("SVGLength"));
});

Deno.test("Test SVGLengthList exists", () => {
  assert(globalKeys.has("SVGLengthList"));
});

Deno.test("Test SVGLinearGradientElement exists", () => {
  assert(globalKeys.has("SVGLinearGradientElement"));
});

Deno.test("Test SVGLineElement exists", () => {
  assert(globalKeys.has("SVGLineElement"));
});

Deno.test("Test SVGMarkerElement exists", () => {
  assert(globalKeys.has("SVGMarkerElement"));
});

Deno.test("Test SVGMaskElement exists", () => {
  assert(globalKeys.has("SVGMaskElement"));
});

Deno.test("Test SVGMetadataElement exists", () => {
  assert(globalKeys.has("SVGMetadataElement"));
});

Deno.test("Test SVGMPathElement exists", () => {
  assert(globalKeys.has("SVGMPathElement"));
});

Deno.test("Test SVGNumber exists", () => {
  assert(globalKeys.has("SVGNumber"));
});

Deno.test("Test SVGNumberList exists", () => {
  assert(globalKeys.has("SVGNumberList"));
});

Deno.test("Test SVGPathElement exists", () => {
  assert(globalKeys.has("SVGPathElement"));
});

Deno.test("Test SVGPatternElement exists", () => {
  assert(globalKeys.has("SVGPatternElement"));
});

Deno.test("Test SVGPoint exists", () => {
  assert(globalKeys.has("SVGPoint"));
});

Deno.test("Test SVGPointList exists", () => {
  assert(globalKeys.has("SVGPointList"));
});

Deno.test("Test SVGPolygonElement exists", () => {
  assert(globalKeys.has("SVGPolygonElement"));
});

Deno.test("Test SVGPolylineElement exists", () => {
  assert(globalKeys.has("SVGPolylineElement"));
});

Deno.test("Test SVGPreserveAspectRatio exists", () => {
  assert(globalKeys.has("SVGPreserveAspectRatio"));
});

Deno.test("Test SVGRadialGradientElement exists", () => {
  assert(globalKeys.has("SVGRadialGradientElement"));
});

Deno.test("Test SVGRect exists", () => {
  assert(globalKeys.has("SVGRect"));
});

Deno.test("Test SVGRectElement exists", () => {
  assert(globalKeys.has("SVGRectElement"));
});

Deno.test("Test SVGScriptElement exists", () => {
  assert(globalKeys.has("SVGScriptElement"));
});

Deno.test("Test SVGSetElement exists", () => {
  assert(globalKeys.has("SVGSetElement"));
});

Deno.test("Test SVGStopElement exists", () => {
  assert(globalKeys.has("SVGStopElement"));
});

Deno.test("Test SVGStringList exists", () => {
  assert(globalKeys.has("SVGStringList"));
});

Deno.test("Test SVGStyleElement exists", () => {
  assert(globalKeys.has("SVGStyleElement"));
});

Deno.test("Test SVGSVGElement exists", () => {
  assert(globalKeys.has("SVGSVGElement"));
});

Deno.test("Test SVGSwitchElement exists", () => {
  assert(globalKeys.has("SVGSwitchElement"));
});

Deno.test("Test SVGSymbolElement exists", () => {
  assert(globalKeys.has("SVGSymbolElement"));
});

Deno.test("Test SVGTextContentElement exists", () => {
  assert(globalKeys.has("SVGTextContentElement"));
});

Deno.test("Test SVGTextElement exists", () => {
  assert(globalKeys.has("SVGTextElement"));
});

Deno.test("Test SVGTextPathElement exists", () => {
  assert(globalKeys.has("SVGTextPathElement"));
});

Deno.test("Test SVGTextPositioningElement exists", () => {
  assert(globalKeys.has("SVGTextPositioningElement"));
});

Deno.test("Test SVGTitleElement exists", () => {
  assert(globalKeys.has("SVGTitleElement"));
});

Deno.test("Test SVGTransform exists", () => {
  assert(globalKeys.has("SVGTransform"));
});

Deno.test("Test SVGTransformList exists", () => {
  assert(globalKeys.has("SVGTransformList"));
});

Deno.test("Test SVGTSpanElement exists", () => {
  assert(globalKeys.has("SVGTSpanElement"));
});

Deno.test("Test SVGUnitTypes exists", () => {
  assert(globalKeys.has("SVGUnitTypes"));
});

Deno.test("Test SVGUseElement exists", () => {
  assert(globalKeys.has("SVGUseElement"));
});

Deno.test("Test SVGViewElement exists", () => {
  assert(globalKeys.has("SVGViewElement"));
});

Deno.test("Test Symbol exists", () => {
  assert(globalKeys.has("Symbol"));
});

Deno.test("Test SyntaxError exists", () => {
  assert(globalKeys.has("SyntaxError"));
});

Deno.test("Test Text exists", () => {
  assert(globalKeys.has("Text"));
});

Deno.test("Test TextDecoder exists", () => {
  assert(globalKeys.has("TextDecoder"));
});

Deno.test("Test TextDecoderStream exists", () => {
  assert(globalKeys.has("TextDecoderStream"));
});

Deno.test("Test TextEncoder exists", () => {
  assert(globalKeys.has("TextEncoder"));
});

Deno.test("Test TextEncoderStream exists", () => {
  assert(globalKeys.has("TextEncoderStream"));
});

Deno.test("Test TextEvent exists", () => {
  assert(globalKeys.has("TextEvent"));
});

Deno.test("Test TextMetrics exists", () => {
  assert(globalKeys.has("TextMetrics"));
});

Deno.test("Test TextTrack exists", () => {
  assert(globalKeys.has("TextTrack"));
});

Deno.test("Test TextTrackCue exists", () => {
  assert(globalKeys.has("TextTrackCue"));
});

Deno.test("Test TextTrackCueList exists", () => {
  assert(globalKeys.has("TextTrackCueList"));
});

Deno.test("Test TextTrackList exists", () => {
  assert(globalKeys.has("TextTrackList"));
});

Deno.test("Test TimeRanges exists", () => {
  assert(globalKeys.has("TimeRanges"));
});

Deno.test("Test ToggleEvent exists", () => {
  assert(globalKeys.has("ToggleEvent"));
});

Deno.test("Test Touch exists", () => {
  assert(globalKeys.has("Touch"));
});

Deno.test("Test TouchEvent exists", () => {
  assert(globalKeys.has("TouchEvent"));
});

Deno.test("Test TouchList exists", () => {
  assert(globalKeys.has("TouchList"));
});

Deno.test("Test TrackEvent exists", () => {
  assert(globalKeys.has("TrackEvent"));
});

Deno.test("Test TransformStream exists", () => {
  assert(globalKeys.has("TransformStream"));
});

Deno.test("Test TransformStreamDefaultController exists", () => {
  assert(globalKeys.has("TransformStreamDefaultController"));
});

Deno.test("Test TransitionEvent exists", () => {
  assert(globalKeys.has("TransitionEvent"));
});

Deno.test("Test TreeWalker exists", () => {
  assert(globalKeys.has("TreeWalker"));
});

Deno.test("Test TypeError exists", () => {
  assert(globalKeys.has("TypeError"));
});

Deno.test("Test UIEvent exists", () => {
  assert(globalKeys.has("UIEvent"));
});

Deno.test("Test Uint16Array exists", () => {
  assert(globalKeys.has("Uint16Array"));
});

Deno.test("Test Uint32Array exists", () => {
  assert(globalKeys.has("Uint32Array"));
});

Deno.test("Test Uint8Array exists", () => {
  assert(globalKeys.has("Uint8Array"));
});

Deno.test("Test Uint8ClampedArray exists", () => {
  assert(globalKeys.has("Uint8ClampedArray"));
});

Deno.test("Test URIError exists", () => {
  assert(globalKeys.has("URIError"));
});

Deno.test("Test URL exists", () => {
  assert(globalKeys.has("URL"));
});

Deno.test("Test URLSearchParams exists", () => {
  assert(globalKeys.has("URLSearchParams"));
});

Deno.test("Test UserActivation exists", () => {
  assert(globalKeys.has("UserActivation"));
});

Deno.test("Test ValidityState exists", () => {
  assert(globalKeys.has("ValidityState"));
});

Deno.test("Test VideoColorSpace exists", () => {
  assert(globalKeys.has("VideoColorSpace"));
});

Deno.test("Test VideoDecoder exists", () => {
  assert(globalKeys.has("VideoDecoder"));
});

Deno.test("Test VideoEncoder exists", () => {
  assert(globalKeys.has("VideoEncoder"));
});

Deno.test("Test VideoFrame exists", () => {
  assert(globalKeys.has("VideoFrame"));
});

Deno.test("Test VideoPlaybackQuality exists", () => {
  assert(globalKeys.has("VideoPlaybackQuality"));
});

Deno.test("Test ViewTransition exists", () => {
  assert(globalKeys.has("ViewTransition"));
});

Deno.test("Test VisualViewport exists", () => {
  assert(globalKeys.has("VisualViewport"));
});

Deno.test("Test VTTCue exists", () => {
  assert(globalKeys.has("VTTCue"));
});

Deno.test("Test VTTRegion exists", () => {
  assert(globalKeys.has("VTTRegion"));
});

Deno.test("Test WakeLock exists", () => {
  assert(globalKeys.has("WakeLock"));
});

Deno.test("Test WakeLockSentinel exists", () => {
  assert(globalKeys.has("WakeLockSentinel"));
});

Deno.test("Test WaveShaperNode exists", () => {
  assert(globalKeys.has("WaveShaperNode"));
});

Deno.test("Test WeakMap exists", () => {
  assert(globalKeys.has("WeakMap"));
});

Deno.test("Test WeakRef exists", () => {
  assert(globalKeys.has("WeakRef"));
});

Deno.test("Test WeakSet exists", () => {
  assert(globalKeys.has("WeakSet"));
});

Deno.test("Test WebGL2RenderingContext exists", () => {
  assert(globalKeys.has("WebGL2RenderingContext"));
});

Deno.test("Test WebGLActiveInfo exists", () => {
  assert(globalKeys.has("WebGLActiveInfo"));
});

Deno.test("Test WebGLBuffer exists", () => {
  assert(globalKeys.has("WebGLBuffer"));
});

Deno.test("Test WebGLContextEvent exists", () => {
  assert(globalKeys.has("WebGLContextEvent"));
});

Deno.test("Test WebGLFramebuffer exists", () => {
  assert(globalKeys.has("WebGLFramebuffer"));
});

Deno.test("Test WebGLProgram exists", () => {
  assert(globalKeys.has("WebGLProgram"));
});

Deno.test("Test WebGLQuery exists", () => {
  assert(globalKeys.has("WebGLQuery"));
});

Deno.test("Test WebGLRenderbuffer exists", () => {
  assert(globalKeys.has("WebGLRenderbuffer"));
});

Deno.test("Test WebGLRenderingContext exists", () => {
  assert(globalKeys.has("WebGLRenderingContext"));
});

Deno.test("Test WebGLSampler exists", () => {
  assert(globalKeys.has("WebGLSampler"));
});

Deno.test("Test WebGLShader exists", () => {
  assert(globalKeys.has("WebGLShader"));
});

Deno.test("Test WebGLShaderPrecisionFormat exists", () => {
  assert(globalKeys.has("WebGLShaderPrecisionFormat"));
});

Deno.test("Test WebGLSync exists", () => {
  assert(globalKeys.has("WebGLSync"));
});

Deno.test("Test WebGLTexture exists", () => {
  assert(globalKeys.has("WebGLTexture"));
});

Deno.test("Test WebGLTransformFeedback exists", () => {
  assert(globalKeys.has("WebGLTransformFeedback"));
});

Deno.test("Test WebGLUniformLocation exists", () => {
  assert(globalKeys.has("WebGLUniformLocation"));
});

Deno.test("Test WebGLVertexArrayObject exists", () => {
  assert(globalKeys.has("WebGLVertexArrayObject"));
});

Deno.test("Test WebSocket exists", () => {
  assert(globalKeys.has("WebSocket"));
});

Deno.test("Test WebTransport exists", () => {
  assert(globalKeys.has("WebTransport"));
});

Deno.test("Test WebTransportBidirectionalStream exists", () => {
  assert(globalKeys.has("WebTransportBidirectionalStream"));
});

Deno.test("Test WebTransportDatagramDuplexStream exists", () => {
  assert(globalKeys.has("WebTransportDatagramDuplexStream"));
});

Deno.test("Test WebTransportError exists", () => {
  assert(globalKeys.has("WebTransportError"));
});

Deno.test("Test WheelEvent exists", () => {
  assert(globalKeys.has("WheelEvent"));
});

Deno.test("Test Window exists", () => {
  assert(globalKeys.has("Window"));
});

Deno.test("Test WindowClient exists", () => {
  assert(globalKeys.has("WindowClient"));
});

Deno.test("Test Worker exists", () => {
  assert(globalKeys.has("Worker"));
});

Deno.test("Test WorkerGlobalScope exists", () => {
  assert(globalKeys.has("WorkerGlobalScope"));
});

Deno.test("Test WorkerLocation exists", () => {
  assert(globalKeys.has("WorkerLocation"));
});

Deno.test("Test WorkerNavigator exists", () => {
  assert(globalKeys.has("WorkerNavigator"));
});

Deno.test("Test Worklet exists", () => {
  assert(globalKeys.has("Worklet"));
});

Deno.test("Test WritableStream exists", () => {
  assert(globalKeys.has("WritableStream"));
});

Deno.test("Test WritableStreamDefaultController exists", () => {
  assert(globalKeys.has("WritableStreamDefaultController"));
});

Deno.test("Test WritableStreamDefaultWriter exists", () => {
  assert(globalKeys.has("WritableStreamDefaultWriter"));
});

Deno.test("Test XMLDocument exists", () => {
  assert(globalKeys.has("XMLDocument"));
});

Deno.test("Test XMLHttpRequest exists", () => {
  assert(globalKeys.has("XMLHttpRequest"));
});

Deno.test("Test XMLHttpRequestEventTarget exists", () => {
  assert(globalKeys.has("XMLHttpRequestEventTarget"));
});

Deno.test("Test XMLHttpRequestUpload exists", () => {
  assert(globalKeys.has("XMLHttpRequestUpload"));
});

Deno.test("Test XMLSerializer exists", () => {
  assert(globalKeys.has("XMLSerializer"));
});

Deno.test("Test XPathEvaluator exists", () => {
  assert(globalKeys.has("XPathEvaluator"));
});

Deno.test("Test XPathExpression exists", () => {
  assert(globalKeys.has("XPathExpression"));
});

Deno.test("Test XPathResult exists", () => {
  assert(globalKeys.has("XPathResult"));
});

Deno.test("Test XSLTProcessor exists", () => {
  assert(globalKeys.has("XSLTProcessor"));
});
