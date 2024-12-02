/**
 * The `Interfaces` class provides sets of global interfaces and types available in the global scope.
 */
export default class Interfaces {
  /**
   * A set containing a comprehenisive list of all available interfaces in the global scope.
   * This set can be used to check if a particular interface is available in the current environment.
   */
  public static allAvailableInterfaces = new Set([
    "AbortController",
    "AbortSignal",
    "AbsoluteOrientationSensor",
    "AbstractRange",
    "Accelerometer",
    "AesCbcParams",
    "AesCtrParams",
    "AesGcmParams",
    "AesKeyGenParams",
    "AggregateError",
    "AmbientLightSensor",
    "AnalyserNode",
    "ANGLE_instanced_arrays",
    "Animation",
    "AnimationEffect",
    "AnimationEvent",
    "AnimationPlaybackEvent",
    "AnimationTimeline",
    "Array",
    "ArrayBuffer",
    "AsyncFunction",
    "AsyncGenerator",
    "AsyncGeneratorFunction",
    "AsyncIterator",
    "Atomics",
    "Attr",
    "AudioBuffer",
    "AudioBufferSourceNode",
    "AudioContext",
    "AudioData",
    "AudioDecoder",
    "AudioDestinationNode",
    "AudioEncoder",
    "AudioListener",
    "AudioNode",
    "AudioParam",
    "AudioParamDescriptor",
    "AudioParamMap",
    "AudioProcessingEvent",
    "AudioScheduledSourceNode",
    "AudioSinkInfo",
    "AudioTrack",
    "AudioTrackList",
    "AudioWorklet",
    "AudioWorkletGlobalScope",
    "AudioWorkletNode",
    "AudioWorkletProcessor",
    "AuthenticatorAssertionResponse",
    "AuthenticatorAttestationResponse",
    "AuthenticatorResponse",
    "BackgroundFetchEvent",
    "BackgroundFetchManager",
    "BackgroundFetchRecord",
    "BackgroundFetchRegistration",
    "BackgroundFetchUpdateUIEvent",
    "BarcodeDetector",
    "BarProp",
    "BaseAudioContext",
    "BatteryManager",
    "BeforeInstallPromptEvent",
    "BeforeUnloadEvent",
    "BigInt",
    "BigInt64Array",
    "BigUint64Array",
    "BiquadFilterNode",
    "Blob",
    "BlobEvent",
    "Bluetooth",
    "BluetoothCharacteristicProperties",
    "BluetoothDevice",
    "BluetoothRemoteGATTCharacteristic",
    "BluetoothRemoteGATTDescriptor",
    "BluetoothRemoteGATTServer",
    "BluetoothRemoteGATTService",
    "BluetoothUUID",
    "Boolean",
    "BroadcastChannel",
    "ByteLengthQueuingStrategy",
    "Cache",
    "CacheStorage",
    "CanMakePaymentEvent",
    "CanvasCaptureMediaStreamTrack",
    "CanvasGradient",
    "CanvasPattern",
    "CanvasRenderingContext2D",
    "CaptureController",
    "CaretPosition",
    "CDATASection",
    "ChannelMergerNode",
    "ChannelSplitterNode",
    "ChapterInformation",
    "CharacterBoundsUpdateEvent",
    "CharacterData",
    "Client",
    "Clients",
    "Clipboard",
    "ClipboardEvent",
    "ClipboardItem",
    "CloseEvent",
    "CloseWatcher",
    "Comment",
    "CompositionEvent",
    "CompressionStream",
    "console",
    "ConstantSourceNode",
    "ContactAddress",
    "ContactsManager",
    "ContentIndex",
    "ContentIndexEvent",
    "ContentVisibilityAutoStateChangeEvent",
    "ConvolverNode",
    "CookieChangeEvent",
    "CookieStore",
    "CookieStoreManager",
    "CountQueuingStrategy",
    "Credential",
    "CredentialsContainer",
    "Crypto",
    "CryptoKey",
    "CryptoKeyPair",
    "CSPViolationReportBody",
    "CSS",
    "CSSAnimation",
    "CSSConditionRule",
    "CSSContainerRule",
    "CSSCounterStyleRule",
    "CSSFontFaceRule",
    "CSSFontFeatureValuesRule",
    "CSSFontPaletteValuesRule",
    "CSSGroupingRule",
    "CSSImageValue",
    "CSSImportRule",
    "CSSKeyframeRule",
    "CSSKeyframesRule",
    "CSSKeywordValue",
    "CSSLayerBlockRule",
    "CSSLayerStatementRule",
    "CSSMathInvert",
    "CSSMathMax",
    "CSSMathMin",
    "CSSMathNegate",
    "CSSMathProduct",
    "CSSMathSum",
    "CSSMathValue",
    "CSSMatrixComponent",
    "CSSMediaRule",
    "CSSNamespaceRule",
    "CSSNumericArray",
    "CSSNumericValue",
    "CSSPageDescriptors",
    "CSSPageRule",
    "CSSPerspective",
    "CSSPositionTryDescriptors",
    "CSSPositionTryRule",
    "CSSPositionValue",
    "CSSPrimitiveValue",
    "CSSPropertyRule",
    "CSSPseudoElement",
    "CSSRotate",
    "CSSRule",
    "CSSRuleList",
    "CSSScale",
    "CSSScopeRule",
    "CSSSkew",
    "CSSSkewX",
    "CSSSkewY",
    "CSSStartingStyleRule",
    "CSSStyleDeclaration",
    "CSSStyleRule",
    "CSSStyleSheet",
    "CSSStyleValue",
    "CSSSupportsRule",
    "CSSTransformComponent",
    "CSSTransformValue",
    "CSSTransition",
    "CSSTranslate",
    "CSSUnitValue",
    "CSSUnparsedValue",
    "CSSValue",
    "CSSValueList",
    "CSSVariableReferenceValue",
    "CustomElementRegistry",
    "CustomEvent",
    "CustomStateSet",
    "DataTransfer",
    "DataTransferItem",
    "DataTransferItemList",
    "DataView",
    "Date",
    "DecompressionStream",
    "DedicatedWorkerGlobalScope",
    "DelayNode",
    "DeprecationReportBody",
    "DeviceMotionEvent",
    "DeviceMotionEventAcceleration",
    "DeviceMotionEventRotationRate",
    "DeviceOrientationEvent",
    "DirectoryEntrySync",
    "DirectoryReaderSync",
    "Document",
    "DocumentFragment",
    "DocumentPictureInPicture",
    "DocumentPictureInPictureEvent",
    "DocumentTimeline",
    "DocumentType",
    "DOMError",
    "DOMException",
    "DOMHighResTimeStamp",
    "DOMImplementation",
    "DOMMatrix",
    "DOMMatrixReadOnly",
    "DOMParser",
    "DOMPoint",
    "DOMPointReadOnly",
    "DOMQuad",
    "DOMRect",
    "DOMRectReadOnly",
    "DOMStringList",
    "DOMStringMap",
    "DOMTokenList",
    "DragEvent",
    "DynamicsCompressorNode",
    "EcdhKeyDeriveParams",
    "EcdsaParams",
    "EcKeyGenParams",
    "EcKeyImportParams",
    "EditContext",
    "Element",
    "ElementInternals",
    "EncodedAudioChunk",
    "EncodedVideoChunk",
    "Error",
    "ErrorEvent",
    "EvalError",
    "Event",
    "EventCounts",
    "EventSource",
    "EventTarget",
    "ExtendableCookieChangeEvent",
    "ExtendableEvent",
    "ExtendableMessageEvent",
    "EyeDropper",
    "FeaturePolicy",
    "FederatedCredential",
    "FederatedCredentialInit",
    "Fence",
    "FencedFrameConfig",
    "FetchEvent",
    "File",
    "FileEntrySync",
    "FileList",
    "FileReader",
    "FileReaderSync",
    "FileSystem",
    "FileSystemDirectoryEntry",
    "FileSystemDirectoryHandle",
    "FileSystemDirectoryReader",
    "FileSystemEntry",
    "FileSystemFileEntry",
    "FileSystemFileHandle",
    "FileSystemHandle",
    "FileSystemSync",
    "FileSystemSyncAccessHandle",
    "FileSystemWritableFileStream",
    "FinalizationRegistry",
    "Float16Array",
    "Float32Array",
    "Float64Array",
    "FocusEvent",
    "FontData",
    "FontFace",
    "FontFaceSet",
    "FontFaceSetLoadEvent",
    "FormData",
    "FormDataEvent",
    "FragmentDirective",
    "Function",
    "GainNode",
    "Gamepad",
    "GamepadButton",
    "GamepadEvent",
    "GamepadHapticActuator",
    "GamepadPose",
    "Generator",
    "GeneratorFunction",
    "Geolocation",
    "GeolocationCoordinates",
    "GeolocationPosition",
    "GeolocationPositionError",
    "GestureEvent",
    "globalThis",
    "GPU",
    "GPUAdapter",
    "GPUAdapterInfo",
    "GPUBindGroup",
    "GPUBindGroupLayout",
    "GPUBuffer",
    "GPUCanvasContext",
    "GPUCommandBuffer",
    "GPUCommandEncoder",
    "GPUCompilationInfo",
    "GPUCompilationMessage",
    "GPUComputePassEncoder",
    "GPUComputePipeline",
    "GPUDevice",
    "GPUDeviceLostInfo",
    "GPUError",
    "GPUExternalTexture",
    "GPUInternalError",
    "GPUOutOfMemoryError",
    "GPUPipelineError",
    "GPUPipelineLayout",
    "GPUQuerySet",
    "GPUQueue",
    "GPURenderBundle",
    "GPURenderBundleEncoder",
    "GPURenderPassEncoder",
    "GPURenderPipeline",
    "GPUSampler",
    "GPUShaderModule",
    "GPUSupportedFeatures",
    "GPUSupportedLimits",
    "GPUTexture",
    "GPUTextureView",
    "GPUUncapturedErrorEvent",
    "GPUValidationError",
    "GravitySensor",
    "Gyroscope",
    "HashChangeEvent",
    "Headers",
    "HID",
    "HIDConnectionEvent",
    "HIDDevice",
    "HIDInputReportEvent",
    "Highlight",
    "HighlightRegistry",
    "History",
    "HkdfParams",
    "HmacImportParams",
    "HmacKeyGenParams",
    "HMDVRDevice",
    "HTMLAllCollection",
    "HTMLAnchorElement",
    "HTMLAreaElement",
    "HTMLAudioElement",
    "HTMLBaseElement",
    "HTMLBodyElement",
    "HTMLBRElement",
    "HTMLButtonElement",
    "HTMLCanvasElement",
    "HTMLCollection",
    "HTMLDataElement",
    "HTMLDataListElement",
    "HTMLDetailsElement",
    "HTMLDialogElement",
    "HTMLDivElement",
    "HTMLDListElement",
    "HTMLDocument",
    "HTMLElement",
    "HTMLEmbedElement",
    "HTMLFencedFrameElement",
    "HTMLFieldSetElement",
    "HTMLFontElement",
    "HTMLFormControlsCollection",
    "HTMLFormElement",
    "HTMLFrameSetElement",
    "HTMLHeadElement",
    "HTMLHeadingElement",
    "HTMLHRElement",
    "HTMLHtmlElement",
    "HTMLIFrameElement",
    "HTMLImageElement",
    "HTMLInputElement",
    "HTMLLabelElement",
    "HTMLLegendElement",
    "HTMLLIElement",
    "HTMLLinkElement",
    "HTMLMapElement",
    "HTMLMarqueeElement",
    "HTMLMediaElement",
    "HTMLMenuElement",
    "HTMLMetaElement",
    "HTMLMeterElement",
    "HTMLModElement",
    "HTMLObjectElement",
    "HTMLOListElement",
    "HTMLOptGroupElement",
    "HTMLOptionElement",
    "HTMLOptionsCollection",
    "HTMLOutputElement",
    "HTMLParagraphElement",
    "HTMLParamElement",
    "HTMLPictureElement",
    "HTMLPreElement",
    "HTMLProgressElement",
    "HTMLQuoteElement",
    "HTMLScriptElement",
    "HTMLSelectElement",
    "HTMLSlotElement",
    "HTMLSourceElement",
    "HTMLSpanElement",
    "HTMLStyleElement",
    "HTMLTableCaptionElement",
    "HTMLTableCellElement",
    "HTMLTableColElement",
    "HTMLTableElement",
    "HTMLTableRowElement",
    "HTMLTableSectionElement",
    "HTMLTemplateElement",
    "HTMLTextAreaElement",
    "HTMLTimeElement",
    "HTMLTitleElement",
    "HTMLTrackElement",
    "HTMLUListElement",
    "HTMLUnknownElement",
    "HTMLVideoElement",
    "IDBCursor",
    "IDBCursorWithValue",
    "IDBDatabase",
    "IDBFactory",
    "IDBIndex",
    "IDBKeyRange",
    "IDBObjectStore",
    "IDBOpenDBRequest",
    "IDBRequest",
    "IDBTransaction",
    "IDBVersionChangeEvent",
    "IdentityCredential",
    "IdentityCredentialRequestOptions",
    "IdentityProvider",
    "IdleDeadline",
    "IdleDetector",
    "IIRFilterNode",
    "ImageBitmap",
    "ImageBitmapRenderingContext",
    "ImageCapture",
    "ImageData",
    "ImageDecoder",
    "ImageTrack",
    "ImageTrackList",
    "Infinity",
    "Ink",
    "InkPresenter",
    "InputDeviceCapabilities",
    "InputDeviceInfo",
    "InputEvent",
    "InstallEvent",
    "Int16Array",
    "Int32Array",
    "Int8Array",
    "InternalError",
    "IntersectionObserver",
    "IntersectionObserverEntry",
    "InterventionReportBody",
    "Intl.Collator",
    "Intl.DateTimeFormat",
    "Intl.DisplayNames",
    "Intl.DurationFormat",
    "Intl.ListFormat",
    "Intl.Locale",
    "Intl.NumberFormat",
    "Intl.PluralRules",
    "Intl.RelativeTimeFormat",
    "Intl.Segmenter",
    "Intl",
    "Iterator",
    "JSON",
    "Keyboard",
    "KeyboardEvent",
    "KeyboardLayoutMap",
    "KeyframeEffect",
    "LargestContentfulPaint",
    "LaunchParams",
    "LaunchQueue",
    "LayoutShift",
    "LayoutShiftAttribution",
    "LinearAccelerationSensor",
    "Location",
    "Lock",
    "LockManager",
    "Magnetometer",
    "Map",
    "Math",
    "MathMLElement",
    "MediaCapabilities",
    "MediaDeviceInfo",
    "MediaDevices",
    "MediaElementAudioSourceNode",
    "MediaEncryptedEvent",
    "MediaError",
    "MediaKeyMessageEvent",
    "MediaKeys",
    "MediaKeySession",
    "MediaKeyStatusMap",
    "MediaKeySystemAccess",
    "MediaList",
    "MediaMetadata",
    "MediaQueryList",
    "MediaQueryListEvent",
    "MediaRecorder",
    "MediaRecorderErrorEvent",
    "MediaSession",
    "MediaSource",
    "MediaSourceHandle",
    "MediaStream",
    "MediaStreamAudioDestinationNode",
    "MediaStreamAudioSourceNode",
    "MediaStreamEvent",
    "MediaStreamTrack",
    "MediaStreamTrackAudioSourceNode",
    "MediaStreamTrackEvent",
    "MediaStreamTrackGenerator",
    "MediaStreamTrackProcessor",
    "MediaTrackConstraints",
    "MediaTrackSettings",
    "MediaTrackSupportedConstraints",
    "MerchantValidationEvent",
    "MessageChannel",
    "MessageEvent",
    "MessagePort",
    "Metadata",
    "MIDIAccess",
    "MIDIConnectionEvent",
    "MIDIInput",
    "MIDIInputMap",
    "MIDIMessageEvent",
    "MIDIOutput",
    "MIDIOutputMap",
    "MIDIPort",
    "MimeType",
    "MimeTypeArray",
    "MouseEvent",
    "MouseScrollEvent",
    "MutationEvent",
    "MutationObserver",
    "MutationRecord",
    "NamedNodeMap",
    "NaN",
    "NavigateEvent",
    "Navigation",
    "NavigationActivation",
    "NavigationCurrentEntryChangeEvent",
    "NavigationDestination",
    "NavigationHistoryEntry",
    "NavigationPreloadManager",
    "NavigationTransition",
    "Navigator",
    "NavigatorLogin",
    "NavigatorUAData",
    "NDEFMessage",
    "NDEFReader",
    "NDEFReadingEvent",
    "NDEFRecord",
    "NetworkInformation",
    "Node",
    "NodeIterator",
    "NodeList",
    "Notification",
    "NotificationEvent",
    "NotRestoredReasonDetails",
    "NotRestoredReasons",
    "Number",
    "Object",
    "OES_draw_buffers_indexed",
    "OfflineAudioCompletionEvent",
    "OfflineAudioContext",
    "OffscreenCanvas",
    "OffscreenCanvasRenderingContext2D",
    "OrientationSensor",
    "OscillatorNode",
    "OTPCredential",
    "OverconstrainedError",
    "PageRevealEvent",
    "PageSwapEvent",
    "PageTransitionEvent",
    "PaintWorkletGlobalScope",
    "PannerNode",
    "PasswordCredential",
    "PasswordCredentialInit",
    "Path2D",
    "PaymentAddress",
    "PaymentManager",
    "PaymentMethodChangeEvent",
    "PaymentRequest",
    "PaymentRequestEvent",
    "PaymentRequestUpdateEvent",
    "PaymentResponse",
    "Pbkdf2Params",
    "Performance",
    "PerformanceElementTiming",
    "PerformanceEntry",
    "PerformanceEventTiming",
    "PerformanceLongAnimationFrameTiming",
    "PerformanceLongTaskTiming",
    "PerformanceMark",
    "PerformanceMeasure",
    "PerformanceNavigation",
    "PerformanceNavigationTiming",
    "PerformanceObserver",
    "PerformanceObserverEntryList",
    "PerformancePaintTiming",
    "PerformanceResourceTiming",
    "PerformanceScriptTiming",
    "PerformanceServerTiming",
    "PerformanceTiming",
    "PeriodicSyncEvent",
    "PeriodicSyncManager",
    "PeriodicWave",
    "Permissions",
    "PermissionStatus",
    "PictureInPictureEvent",
    "PictureInPictureWindow",
    "Plugin",
    "PluginArray",
    "Point",
    "PointerEvent",
    "PopStateEvent",
    "PositionSensorVRDevice",
    "Presentation",
    "PresentationAvailability",
    "PresentationConnection",
    "PresentationConnectionAvailableEvent",
    "PresentationConnectionCloseEvent",
    "PresentationConnectionList",
    "PresentationReceiver",
    "PresentationRequest",
    "PressureObserver",
    "PressureRecord",
    "ProcessingInstruction",
    "ProgressEvent",
    "Promise",
    "PromiseRejectionEvent",
    "Proxy",
    "PublicKeyCredential",
    "PublicKeyCredentialCreationOptions",
    "PublicKeyCredentialRequestOptions",
    "PushEvent",
    "PushManager",
    "PushMessageData",
    "PushSubscription",
    "PushSubscriptionOptions",
    "RadioNodeList",
    "Range",
    "RangeError",
    "ReadableByteStreamController",
    "ReadableStream",
    "ReadableStreamBYOBReader",
    "ReadableStreamBYOBRequest",
    "ReadableStreamDefaultController",
    "ReadableStreamDefaultReader",
    "ReferenceError",
    "Reflect",
    "RegExp",
    "RelativeOrientationSensor",
    "RemotePlayback",
    "Report",
    "ReportBody",
    "ReportingObserver",
    "Request",
    "RequestInit",
    "ResizeObserver",
    "ResizeObserverEntry",
    "ResizeObserverSize",
    "Response",
    "RsaHashedImportParams",
    "RsaHashedKeyGenParams",
    "RsaOaepParams",
    "RsaPssParams",
    "RTCAudioSourceStats",
    "RTCCertificate",
    "RTCCertificateStats",
    "RTCCodecStats",
    "RTCDataChannel",
    "RTCDataChannelEvent",
    "RTCDataChannelStats",
    "RTCDtlsTransport",
    "RTCDTMFSender",
    "RTCDTMFToneChangeEvent",
    "RTCEncodedAudioFrame",
    "RTCEncodedVideoFrame",
    "RTCError",
    "RTCErrorEvent",
    "RTCIceCandidate",
    "RTCIceCandidatePair",
    "RTCIceCandidatePairStats",
    "RTCIceCandidateStats",
    "RTCIceParameters",
    "RTCIceTransport",
    "RTCIdentityAssertion",
    "RTCInboundRtpStreamStats",
    "RTCOutboundRtpStreamStats",
    "RTCPeerConnection",
    "RTCPeerConnectionIceErrorEvent",
    "RTCPeerConnectionIceEvent",
    "RTCPeerConnectionStats",
    "RTCRemoteInboundRtpStreamStats",
    "RTCRemoteOutboundRtpStreamStats",
    "RTCRtpReceiver",
    "RTCRtpScriptTransform",
    "RTCRtpScriptTransformer",
    "RTCRtpSender",
    "RTCRtpStreamStats",
    "RTCRtpTransceiver",
    "RTCSctpTransport",
    "RTCSessionDescription",
    "RTCStatsReport",
    "RTCTrackEvent",
    "RTCTransformEvent",
    "RTCTransportStats",
    "RTCVideoSourceStats",
    "Scheduler",
    "Scheduling",
    "Screen",
    "ScreenDetailed",
    "ScreenDetails",
    "ScreenOrientation",
    "ScriptProcessorNode",
    "ScrollTimeline",
    "SecurePaymentConfirmationRequest",
    "SecurityPolicyViolationEvent",
    "Selection",
    "Sensor",
    "SensorErrorEvent",
    "Serial",
    "SerialPort",
    "ServiceWorker",
    "ServiceWorkerContainer",
    "ServiceWorkerGlobalScope",
    "ServiceWorkerRegistration",
    "Set",
    "ShadowRoot",
    "SharedArrayBuffer",
    "SharedStorage",
    "SharedStorageOperation",
    "SharedStorageRunOperation",
    "SharedStorageSelectURLOperation",
    "SharedStorageWorklet",
    "SharedStorageWorkletGlobalScope",
    "SharedWorker",
    "SharedWorkerGlobalScope",
    "SnapEvent",
    "SourceBuffer",
    "SourceBufferList",
    "SpeechGrammar",
    "SpeechGrammarList",
    "SpeechRecognition",
    "SpeechRecognitionAlternative",
    "SpeechRecognitionErrorEvent",
    "SpeechRecognitionEvent",
    "SpeechRecognitionResult",
    "SpeechRecognitionResultList",
    "SpeechSynthesis",
    "SpeechSynthesisErrorEvent",
    "SpeechSynthesisEvent",
    "SpeechSynthesisUtterance",
    "SpeechSynthesisVoice",
    "StaticRange",
    "StereoPannerNode",
    "Storage",
    "StorageAccessHandle",
    "StorageEvent",
    "StorageManager",
    "String",
    "StylePropertyMap",
    "StylePropertyMapReadOnly",
    "StyleSheet",
    "StyleSheetList",
    "SubmitEvent",
    "SubtleCrypto",
    "SVGAElement",
    "SVGAngle",
    "SVGAnimateColorElement",
    "SVGAnimatedAngle",
    "SVGAnimatedBoolean",
    "SVGAnimatedEnumeration",
    "SVGAnimatedInteger",
    "SVGAnimatedLength",
    "SVGAnimatedLengthList",
    "SVGAnimatedNumber",
    "SVGAnimatedNumberList",
    "SVGAnimatedPreserveAspectRatio",
    "SVGAnimatedRect",
    "SVGAnimatedString",
    "SVGAnimatedTransformList",
    "SVGAnimateElement",
    "SVGAnimateMotionElement",
    "SVGAnimateTransformElement",
    "SVGAnimationElement",
    "SVGCircleElement",
    "SVGClipPathElement",
    "SVGComponentTransferFunctionElement",
    "SVGCursorElement",
    "SVGDefsElement",
    "SVGDescElement",
    "SVGElement",
    "SVGEllipseElement",
    "SVGEvent",
    "SVGFEBlendElement",
    "SVGFEColorMatrixElement",
    "SVGFEComponentTransferElement",
    "SVGFECompositeElement",
    "SVGFEConvolveMatrixElement",
    "SVGFEDiffuseLightingElement",
    "SVGFEDisplacementMapElement",
    "SVGFEDistantLightElement",
    "SVGFEDropShadowElement",
    "SVGFEFloodElement",
    "SVGFEFuncAElement",
    "SVGFEFuncBElement",
    "SVGFEFuncGElement",
    "SVGFEFuncRElement",
    "SVGFEGaussianBlurElement",
    "SVGFEImageElement",
    "SVGFEMergeElement",
    "SVGFEMergeNodeElement",
    "SVGFEMorphologyElement",
    "SVGFEOffsetElement",
    "SVGFEPointLightElement",
    "SVGFESpecularLightingElement",
    "SVGFESpotLightElement",
    "SVGFETileElement",
    "SVGFETurbulenceElement",
    "SVGFilterElement",
    "SVGFontElement",
    "SVGFontFaceElement",
    "SVGFontFaceFormatElement",
    "SVGFontFaceNameElement",
    "SVGFontFaceSrcElement",
    "SVGFontFaceUriElement",
    "SVGForeignObjectElement",
    "SVGGElement",
    "SVGGeometryElement",
    "SVGGlyphElement",
    "SVGGlyphRefElement",
    "SVGGradientElement",
    "SVGGraphicsElement",
    "SVGHKernElement",
    "SVGImageElement",
    "SVGLength",
    "SVGLengthList",
    "SVGLinearGradientElement",
    "SVGLineElement",
    "SVGMarkerElement",
    "SVGMaskElement",
    "SVGMetadataElement",
    "SVGMissingGlyphElement",
    "SVGMPathElement",
    "SVGNumber",
    "SVGNumberList",
    "SVGPathElement",
    "SVGPatternElement",
    "SVGPoint",
    "SVGPointList",
    "SVGPolygonElement",
    "SVGPolylineElement",
    "SVGPreserveAspectRatio",
    "SVGRadialGradientElement",
    "SVGRect",
    "SVGRectElement",
    "SVGRenderingIntent",
    "SVGScriptElement",
    "SVGSetElement",
    "SVGStopElement",
    "SVGStringList",
    "SVGStyleElement",
    "SVGSVGElement",
    "SVGSwitchElement",
    "SVGSymbolElement",
    "SVGTextContentElement",
    "SVGTextElement",
    "SVGTextPathElement",
    "SVGTextPositioningElement",
    "SVGTitleElement",
    "SVGTransform",
    "SVGTransformList",
    "SVGTRefElement",
    "SVGTSpanElement",
    "SVGUnitTypes",
    "SVGUseElement",
    "SVGViewElement",
    "SVGVKernElement",
    "Symbol",
    "SyncEvent",
    "SyncManager",
    "SyntaxError",
    "TaskAttributionTiming",
    "TaskController",
    "TaskPriorityChangeEvent",
    "TaskSignal",
    "Text",
    "TextDecoder",
    "TextDecoderStream",
    "TextEncoder",
    "TextEncoderStream",
    "TextEvent",
    "TextFormat",
    "TextFormatUpdateEvent",
    "TextMetrics",
    "TextTrack",
    "TextTrackCue",
    "TextTrackCueList",
    "TextTrackList",
    "TextUpdateEvent",
    "TimeEvent",
    "TimeRanges",
    "ToggleEvent",
    "Touch",
    "TouchEvent",
    "TouchList",
    "TrackEvent",
    "TransformStream",
    "TransformStreamDefaultController",
    "TransitionEvent",
    "TreeWalker",
    "TrustedHTML",
    "TrustedScript",
    "TrustedScriptURL",
    "TrustedTypePolicy",
    "TrustedTypePolicyFactory",
    "TypedArray",
    "TypeError",
    "UIEvent",
    "Uint16Array",
    "Uint32Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "URIError",
    "URL",
    "URLPattern",
    "URLSearchParams",
    "USB",
    "USBAlternateInterface",
    "USBConfiguration",
    "USBConnectionEvent",
    "USBDevice",
    "USBEndpoint",
    "USBInterface",
    "USBInTransferResult",
    "USBIsochronousInTransferPacket",
    "USBIsochronousInTransferResult",
    "USBIsochronousOutTransferPacket",
    "USBIsochronousOutTransferResult",
    "USBOutTransferResult",
    "UserActivation",
    "ValidityState",
    "VideoColorSpace",
    "VideoDecoder",
    "VideoEncoder",
    "VideoFrame",
    "VideoPlaybackQuality",
    "VideoTrack",
    "VideoTrackList",
    "ViewTimeline",
    "ViewTransition",
    "VirtualKeyboard",
    "VisibilityStateEntry",
    "VisualViewport",
    "VRDisplay",
    "VRDisplayCapabilities",
    "VRDisplayEvent",
    "VREyeParameters",
    "VRFieldOfView",
    "VRFrameData",
    "VRLayerInit",
    "VRPose",
    "VRStageParameters",
    "VTTCue",
    "VTTRegion",
    "WakeLock",
    "WakeLockSentinel",
    "WaveShaperNode",
    "WeakMap",
    "WeakRef",
    "WeakSet",
    "WebGL2RenderingContext",
    "WebGLActiveInfo",
    "WebGLBuffer",
    "WebGLContextEvent",
    "WebGLFramebuffer",
    "WebGLObject",
    "WebGLProgram",
    "WebGLQuery",
    "WebGLRenderbuffer",
    "WebGLRenderingContext",
    "WebGLSampler",
    "WebGLShader",
    "WebGLShaderPrecisionFormat",
    "WebGLSync",
    "WebGLTexture",
    "WebGLTransformFeedback",
    "WebGLUniformLocation",
    "WebGLVertexArrayObject",
    "WebSocket",
    "WebSocketStream",
    "WebTransport",
    "WebTransportBidirectionalStream",
    "WebTransportDatagramDuplexStream",
    "WebTransportError",
    "WebTransportReceiveStream",
    "WebTransportSendStream",
    "WGSLLanguageFeatures",
    "WheelEvent",
    "Window",
    "WindowClient",
    "WindowControlsOverlay",
    "WindowControlsOverlayGeometryChangeEvent",
    "WindowSharedStorage",
    "Worker",
    "WorkerGlobalScope",
    "WorkerLocation",
    "WorkerNavigator",
    "Worklet",
    "WorkletGlobalScope",
    "WorkletSharedStorage",
    "WritableStream",
    "WritableStreamDefaultController",
    "WritableStreamDefaultWriter",
    "XMLDocument",
    "XMLHttpRequest",
    "XMLHttpRequestEventTarget",
    "XMLHttpRequestUpload",
    "XMLSerializer",
    "XPathEvaluator",
    "XPathException",
    "XPathExpression",
    "XPathResult",
    "XRAnchor",
    "XRAnchorSet",
    "XRBoundedReferenceSpace",
    "XRCompositionLayer",
    "XRCPUDepthInformation",
    "XRCubeLayer",
    "XRCylinderLayer",
    "XRDepthInformation",
    "XREquirectLayer",
    "XRFrame",
    "XRHand",
    "XRHitTestResult",
    "XRHitTestSource",
    "XRInputSource",
    "XRInputSourceArray",
    "XRInputSourceEvent",
    "XRInputSourcesChangeEvent",
    "XRJointPose",
    "XRJointSpace",
    "XRLayer",
    "XRLayerEvent",
    "XRLightEstimate",
    "XRLightProbe",
    "XRMediaBinding",
    "XRPose",
    "XRProjectionLayer",
    "XRQuadLayer",
    "XRRay",
    "XRReferenceSpace",
    "XRReferenceSpaceEvent",
    "XRRenderState",
    "XRRigidTransform",
    "XRSession",
    "XRSessionEvent",
    "XRSpace",
    "XRSubImage",
    "XRSystem",
    "XRTransientInputHitTestResult",
    "XRTransientInputHitTestSource",
    "XRView",
    "XRViewerPose",
    "XRViewport",
    "XRWebGLBinding",
    "XRWebGLDepthInformation",
    "XRWebGLLayer",
    "XRWebGLSubImage",
    "XSLTProcessor",
  ]);

  /**
   * A set of global interfaces and types that are not yet included in TypeScript's standard library.
   * This set can be used to track and manage the missing global types that may be needed for various
   * web APIs and other JavaScript features.
   */
  public static notInTsLibsYet = new Set([
    "AbsoluteOrientationSensor",
    "Accelerometer",
    "AesCbcParams",
    "AesCtrParams",
    "AesGcmParams",
    "AesKeyGenParams",
    "AmbientLightSensor",
    "ANGLE_instanced_arrays",
    "AsyncFunction",
    "AsyncIterator",
    "AudioParamDescriptor",
    "AudioSinkInfo",
    "AudioTrack",
    "AudioTrackList",
    "AudioWorkletGlobalScope",
    "AudioWorkletProcessor",
    "BackgroundFetchEvent",
    "BackgroundFetchManager",
    "BackgroundFetchRecord",
    "BackgroundFetchRegistration",
    "BackgroundFetchUpdateUIEvent",
    "BarcodeDetector",
    "BatteryManager",
    "BeforeInstallPromptEvent",
    "Bluetooth",
    "BluetoothCharacteristicProperties",
    "BluetoothDevice",
    "BluetoothRemoteGATTCharacteristic",
    "BluetoothRemoteGATTDescriptor",
    "BluetoothRemoteGATTServer",
    "BluetoothRemoteGATTService",
    "BluetoothUUID",
    "CanMakePaymentEvent",
    "CaptureController",
    "ChapterInformation",
    "CharacterBoundsUpdateEvent",
    "CloseWatcher",
    "ContactAddress",
    "ContactsManager",
    "ContentIndex",
    "ContentIndexEvent",
    "CookieChangeEvent",
    "CookieStore",
    "CookieStoreManager",
    "CryptoKeyPair",
    "CSPViolationReportBody",
    "CSSPageDescriptors",
    "CSSPositionTryDescriptors",
    "CSSPositionTryRule",
    "CSSPositionValue",
    "CSSPrimitiveValue",
    "CSSPseudoElement",
    "CSSValue",
    "CSSValueList",
    "DeprecationReportBody",
    "DeviceMotionEventAcceleration",
    "DeviceMotionEventRotationRate",
    "DirectoryEntrySync",
    "DirectoryReaderSync",
    "DocumentPictureInPicture",
    "DocumentPictureInPictureEvent",
    "DOMError",
    "DOMHighResTimeStamp",
    "EcdhKeyDeriveParams",
    "EcdsaParams",
    "EcKeyGenParams",
    "EcKeyImportParams",
    "EditContext",
    "ExtendableCookieChangeEvent",
    "EyeDropper",
    "FeaturePolicy",
    "FederatedCredential",
    "FederatedCredentialInit",
    "Fence",
    "FencedFrameConfig",
    "FileEntrySync",
    "FileSystemSync",
    "Float16Array",
    "FontData",
    "GamepadPose",
    "GestureEvent",
    "globalThis",
    "GPU",
    "GPUAdapter",
    "GPUAdapterInfo",
    "GPUBindGroup",
    "GPUBindGroupLayout",
    "GPUBuffer",
    "GPUCanvasContext",
    "GPUCommandBuffer",
    "GPUCommandEncoder",
    "GPUCompilationInfo",
    "GPUCompilationMessage",
    "GPUComputePassEncoder",
    "GPUComputePipeline",
    "GPUDevice",
    "GPUDeviceLostInfo",
    "GPUError",
    "GPUExternalTexture",
    "GPUInternalError",
    "GPUOutOfMemoryError",
    "GPUPipelineError",
    "GPUPipelineLayout",
    "GPUQuerySet",
    "GPUQueue",
    "GPURenderBundle",
    "GPURenderBundleEncoder",
    "GPURenderPassEncoder",
    "GPURenderPipeline",
    "GPUSampler",
    "GPUShaderModule",
    "GPUSupportedFeatures",
    "GPUSupportedLimits",
    "GPUTexture",
    "GPUTextureView",
    "GPUUncapturedErrorEvent",
    "GPUValidationError",
    "GravitySensor",
    "Gyroscope",
    "HID",
    "HIDConnectionEvent",
    "HIDDevice",
    "HIDInputReportEvent",
    "HkdfParams",
    "HmacImportParams",
    "HmacKeyGenParams",
    "HMDVRDevice",
    "HTMLFencedFrameElement",
    "IdentityCredential",
    "IdentityCredentialRequestOptions",
    "IdentityProvider",
    "IdleDetector",
    "ImageCapture",
    "ImageDecoder",
    "ImageTrack",
    "ImageTrackList",
    "Ink",
    "InkPresenter",
    "InputDeviceCapabilities",
    "InstallEvent",
    "InternalError",
    "InterventionReportBody",
    "Intl.Collator",
    "Intl.DateTimeFormat",
    "Intl.DisplayNames",
    "Intl.DurationFormat",
    "Intl.ListFormat",
    "Intl.Locale",
    "Intl.NumberFormat",
    "Intl.PluralRules",
    "Intl.RelativeTimeFormat",
    "Intl.Segmenter",
    "Keyboard",
    "KeyboardLayoutMap",
    "LaunchParams",
    "LaunchQueue",
    "LayoutShift",
    "LayoutShiftAttribution",
    "LinearAccelerationSensor",
    "Magnetometer",
    "MediaRecorderErrorEvent",
    "MediaStreamEvent",
    "MediaStreamTrackAudioSourceNode",
    "MediaStreamTrackGenerator",
    "MediaTrackConstraints",
    "MediaTrackSettings",
    "MediaTrackSupportedConstraints",
    "MerchantValidationEvent",
    "Metadata",
    "MouseScrollEvent",
    "MutationEvent",
    "NavigateEvent",
    "Navigation",
    "NavigationActivation",
    "NavigationCurrentEntryChangeEvent",
    "NavigationDestination",
    "NavigationHistoryEntry",
    "NavigationTransition",
    "NavigatorLogin",
    "NavigatorUAData",
    "NDEFMessage",
    "NDEFReader",
    "NDEFReadingEvent",
    "NDEFRecord",
    "NetworkInformation",
    "NotRestoredReasonDetails",
    "NotRestoredReasons",
    "OES_draw_buffers_indexed",
    "OrientationSensor",
    "OTPCredential",
    "PageRevealEvent",
    "PageSwapEvent",
    "PaintWorkletGlobalScope",
    "PasswordCredential",
    "PasswordCredentialInit",
    "PaymentManager",
    "PaymentRequestEvent",
    "Pbkdf2Params",
    "PerformanceElementTiming",
    "PerformanceLongAnimationFrameTiming",
    "PerformanceLongTaskTiming",
    "PerformanceScriptTiming",
    "PeriodicSyncEvent",
    "PeriodicSyncManager",
    "Point",
    "PositionSensorVRDevice",
    "Presentation",
    "PresentationAvailability",
    "PresentationConnection",
    "PresentationConnectionAvailableEvent",
    "PresentationConnectionCloseEvent",
    "PresentationConnectionList",
    "PresentationReceiver",
    "PresentationRequest",
    "PressureObserver",
    "PressureRecord",
    "PublicKeyCredentialCreationOptions",
    "PublicKeyCredentialRequestOptions",
    "RelativeOrientationSensor",
    "RequestInit",
    "RsaHashedImportParams",
    "RsaHashedKeyGenParams",
    "RsaOaepParams",
    "RsaPssParams",
    "RTCAudioSourceStats",
    "RTCCertificateStats",
    "RTCCodecStats",
    "RTCDataChannelStats",
    "RTCIceCandidatePair",
    "RTCIceCandidatePairStats",
    "RTCIceCandidateStats",
    "RTCIceParameters",
    "RTCIdentityAssertion",
    "RTCInboundRtpStreamStats",
    "RTCOutboundRtpStreamStats",
    "RTCPeerConnectionStats",
    "RTCRemoteInboundRtpStreamStats",
    "RTCRemoteOutboundRtpStreamStats",
    "RTCRtpStreamStats",
    "RTCTransportStats",
    "RTCVideoSourceStats",
    "Scheduler",
    "Scheduling",
    "ScreenDetailed",
    "ScreenDetails",
    "ScrollTimeline",
    "SecurePaymentConfirmationRequest",
    "Sensor",
    "SensorErrorEvent",
    "Serial",
    "SerialPort",
    "SharedStorage",
    "SharedStorageOperation",
    "SharedStorageRunOperation",
    "SharedStorageSelectURLOperation",
    "SharedStorageWorklet",
    "SharedStorageWorkletGlobalScope",
    "SnapEvent",
    "SpeechGrammar",
    "SpeechGrammarList",
    "SpeechRecognition",
    "SpeechRecognitionErrorEvent",
    "SpeechRecognitionEvent",
    "StorageAccessHandle",
    "SVGAnimateColorElement",
    "SVGCursorElement",
    "SVGEvent",
    "SVGFontElement",
    "SVGFontFaceElement",
    "SVGFontFaceFormatElement",
    "SVGFontFaceNameElement",
    "SVGFontFaceSrcElement",
    "SVGFontFaceUriElement",
    "SVGGlyphElement",
    "SVGGlyphRefElement",
    "SVGHKernElement",
    "SVGMissingGlyphElement",
    "SVGRenderingIntent",
    "SVGTRefElement",
    "SVGVKernElement",
    "SyncEvent",
    "SyncManager",
    "TaskAttributionTiming",
    "TaskController",
    "TaskPriorityChangeEvent",
    "TaskSignal",
    "TextFormat",
    "TextFormatUpdateEvent",
    "TextUpdateEvent",
    "TimeEvent",
    "TrustedHTML",
    "TrustedScript",
    "TrustedScriptURL",
    "TrustedTypePolicy",
    "TrustedTypePolicyFactory",
    "TypedArray",
    "URLPattern",
    "USB",
    "USBAlternateInterface",
    "USBConfiguration",
    "USBConnectionEvent",
    "USBDevice",
    "USBEndpoint",
    "USBInterface",
    "USBInTransferResult",
    "USBIsochronousInTransferPacket",
    "USBIsochronousInTransferResult",
    "USBIsochronousOutTransferPacket",
    "USBIsochronousOutTransferResult",
    "USBOutTransferResult",
    "VideoTrack",
    "VideoTrackList",
    "ViewTimeline",
    "VirtualKeyboard",
    "VisibilityStateEntry",
    "VRDisplay",
    "VRDisplayCapabilities",
    "VRDisplayEvent",
    "VREyeParameters",
    "VRFieldOfView",
    "VRFrameData",
    "VRLayerInit",
    "VRPose",
    "VRStageParameters",
    "WebGLObject",
    "WebSocketStream",
    "WebTransportReceiveStream",
    "WebTransportSendStream",
    "WGSLLanguageFeatures",
    "WindowControlsOverlay",
    "WindowControlsOverlayGeometryChangeEvent",
    "WindowSharedStorage",
    "WorkletGlobalScope",
    "WorkletSharedStorage",
    "XPathException",
    "XRAnchor",
    "XRAnchorSet",
    "XRBoundedReferenceSpace",
    "XRCompositionLayer",
    "XRCPUDepthInformation",
    "XRCubeLayer",
    "XRCylinderLayer",
    "XRDepthInformation",
    "XREquirectLayer",
    "XRFrame",
    "XRHand",
    "XRHitTestResult",
    "XRHitTestSource",
    "XRInputSource",
    "XRInputSourceArray",
    "XRInputSourceEvent",
    "XRInputSourcesChangeEvent",
    "XRJointPose",
    "XRJointSpace",
    "XRLayer",
    "XRLayerEvent",
    "XRLightEstimate",
    "XRLightProbe",
    "XRMediaBinding",
    "XRPose",
    "XRProjectionLayer",
    "XRQuadLayer",
    "XRRay",
    "XRReferenceSpace",
    "XRReferenceSpaceEvent",
    "XRRenderState",
    "XRRigidTransform",
    "XRSession",
    "XRSessionEvent",
    "XRSpace",
    "XRSubImage",
    "XRSystem",
    "XRTransientInputHitTestResult",
    "XRTransientInputHitTestSource",
    "XRView",
    "XRViewerPose",
    "XRViewport",
    "XRWebGLBinding",
    "XRWebGLDepthInformation",
    "XRWebGLLayer",
    "XRWebGLSubImage",
  ]);
}