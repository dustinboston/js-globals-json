import type { Builtins } from './javascript_definitions.ts';
import { htmlTags, HtmlDomInterfaces  } from './types.ts';
import { and, any, arr, bool, ctor, fn, iter, nil, num, obj, or, str, undef } from './params.ts';
export type { BuiltinDefn, Builtins, DefnType, NamedParam, ParamType} from './params.ts';

// MARK: ✅ ARIA MIXIN
function ariaMixin(className: string): Builtins {
  const ariaAttributes: Builtins = {
    [`${className}.prototype.ariaAtomic`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaAutoComplete`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaBrailleLabel`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaBrailleRoleDescription`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaBusy`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaChecked`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaColCount`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaColIndex`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaColIndexText`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaColSpan`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaCurrent`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaDescription`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaDisabled`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaExpanded`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaHasPopup`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaHidden`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaInvalid`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaKeyShortcuts`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaLabel`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaLevel`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaLive`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaModal`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaMultiLine`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaMultiSelectable`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaOrientation`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaPlaceholder`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaPosInSet`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaPressed`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaReadOnly`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaRequired`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaRoleDescription`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaRowCount`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaRowIndex`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaRowIndexText`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaRowSpan`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaSelected`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaSetSize`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaSort`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaValueMax`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaValueMin`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaValueNow`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.ariaValueText`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
    [`${className}.prototype.role`]: {
      type: 'InstanceProperty',
      params: [],
      returns: or(str(), nil()),
      inherits: [],
    },
  };
  return ariaAttributes;
}

// MARK: ✅ EVENT
function inheritEvent(name: string): Builtins {
  const eventBuiltin: Builtins = {
    [`${name}.prototype.bubbles`]: {
      type: 'InstanceProperty',
      params: [],
      returns: any(),
      inherits: ['Event'],
    },
    [`${name}.prototype.cancelable`]: {
      type: 'InstanceProperty',
      params: [],
      returns: any(),
      inherits: ['Event'],
    },
    [`${name}.prototype.cancelBubbleDeprecated`]: {
      type: 'InstanceProperty',
      params: [],
      returns: any(),
      inherits: ['Event'],
    },
    [`${name}.prototype.composed`]: {
      type: 'InstanceProperty',
      params: [],
      returns: any(),
      inherits: ['Event'],
    },
    [`${name}.prototype.currentTarget`]: {
      type: 'InstanceProperty',
      params: [],
      returns: any(),
      inherits: ['Event'],
    },
    [`${name}.prototype.defaultPrevented`]: {
      type: 'InstanceProperty',
      params: [],
      returns: any(),
      inherits: ['Event'],
    },
    [`${name}.prototype.eventPhase`]: {
      type: 'InstanceProperty',
      params: [],
      returns: any(),
      inherits: ['Event'],
    },
    [`${name}.prototype.isTrusted`]: {
      type: 'InstanceProperty',
      params: [],
      returns: any(),
      inherits: ['Event'],
    },
    [`${name}.prototype.returnValueDeprecated`]: {
      type: 'InstanceProperty',
      params: [],
      returns: any(),
      inherits: ['Event'],
    },
    [`${name}.prototype.srcElementDeprecated`]: {
      type: 'InstanceProperty',
      params: [],
      returns: any(),
      inherits: ['Event'],
    },
    [`${name}.prototype.target`]: {
      type: 'InstanceProperty',
      params: [],
      returns: any(),
      inherits: ['Event'],
    },
    [`${name}.prototype.timeStamp`]: {
      type: 'InstanceProperty',
      params: [],
      returns: any(),
      inherits: ['Event'],
    },
    [`${name}.prototype.type`]: {
      type: 'InstanceProperty',
      params: [],
      returns: any(),
      inherits: ['Event'],
    },
    [`${name}.prototype.composedPath`]: {
      type: 'InstanceMethod',
      params: [],
      returns: any(),
      inherits: ['Event'],
    },
    [`${name}.prototype.initEventDeprecated`]: {
      type: 'InstanceMethod',
      params: [],
      returns: any(),
      inherits: ['Event'],
    },
    [`${name}.prototype.preventDefault`]: {
      type: 'InstanceMethod',
      params: [],
      returns: any(),
      inherits: ['Event'],
    },
    [`${name}.prototype.stopImmediatePropagation`]: {
      type: 'InstanceMethod',
      params: [],
      returns: any(),
      inherits: ['Event'],
    },
    [`${name}.prototype.stopPropagation`]: {
      type: 'InstanceMethod',
      params: [],
      returns: any(),
      inherits: ['Event'],
    },
  };
  return eventBuiltin;
}

const builtinEvent = {
  ...inheritEvent('Event'),
  ['Event.new']: {
    type: 'Constructor',
    params: [],
    returns: ctor('Event'),
    inherits: [],
  },
};

// MARK: ✅ EVT TARGET
function inheritEventTarget(name: string): Builtins {
  const eventTargetBuiltin: Builtins = {
    [`${name}.prototype.addEventListener`]: {
      type: 'InstanceMethod',
      params: [['type', str()], ['listener', fn()], ['options?', or(bool(), obj())]],
      returns: undef(),
      inherits: ['EventTarget'],
    },
    [`${name}.prototype.dispatchEvent`]: {
      type: 'InstanceMethod',
      params: [['event', ctor('Event')]],
      returns: bool(),
      inherits: ['EventTarget'],
    },
    [`${name}.prototype.removeEventListener`]: {
      type: 'InstanceMethod',
      params: [['type', str()], ['listener', fn()], ['options?', or(bool(), obj())]],
      returns: undef(),
      inherits: ['EventTarget'],
    },
  };
  return eventTargetBuiltin;
}

const eventTargetBuiltin: Builtins = {
  ...inheritEventTarget('EventTarget'),
  [`EventTarget.new`]: {
    type: 'Constructor',
    params: [],
    returns: ctor('EventTarget'),
    inherits: ['EventTarget'],
  },
};

// MARK: ✅ CHAR DATA
function inheritCharacterData(name: string): Builtins {
  const characterDataBuiltin: Builtins = {
    ...inheritNode('Node'),
    [`${name}.prototype.data`]: {
      type: 'InstanceProperty',
      params: [],
      returns: str(),
      inherits: ['CharacterData'],
    },
    [`${name}.prototype.length`]: {
      type: 'InstanceProperty',
      params: [],
      returns: num(),
      inherits: ['CharacterData'],
    },
    [`${name}.prototype.nextElementSibling`]: {
      type: 'InstanceProperty',
      params: [],
      returns: obj(),
      inherits: ['CharacterData'],
    },
    [`${name}.prototype.previousElementSibling`]: {
      type: 'InstanceProperty',
      params: [],
      returns: obj(),
      inherits: ['CharacterData'],
    },
    [`${name}.prototype.after`]: {
      type: 'InstanceMethod',
      params: [['parameter1', obj()]],
      returns: undef(),
      inherits: ['CharacterData'],
    },
    [`${name}.prototype.appendData`]: {
      type: 'InstanceMethod',
      params: [['parameter1', str()]],
      returns: undef(),
      inherits: ['CharacterData'],
    },
    [`${name}.prototype.before`]: {
      type: 'InstanceMethod',
      params: [['parameter1', obj()]],
      returns: undef(),
      inherits: ['CharacterData'],
    },
    [`${name}.prototype.deleteData`]: {
      type: 'InstanceMethod',
      params: [['start', num()], ['count', num()]],
      returns: undef(),
      inherits: ['CharacterData'],
    },
    [`${name}.prototype.insertData`]: {
      type: 'InstanceMethod',
      params: [['offset', num()], ['data', str()]],
      returns: undef(),
      inherits: ['CharacterData'],
    },
    [`${name}.prototype.remove`]: {
      type: 'InstanceMethod',
      params: [],
      returns: undef(),
      inherits: ['CharacterData'],
    },
    [`${name}.prototype.replaceData`]: {
      type: 'InstanceMethod',
      params: [
        ['offset', num()],
        ['count', num()],
        ['data', str()],
      ],
      returns: undef(),
      inherits: ['CharacterData'],
    },
    [`${name}.prototype.replaceWith`]: {
      type: 'InstanceMethod',
      params: [['parameter1', obj()]],
      returns: undef(),
      inherits: ['CharacterData'],
    },
    [`${name}.prototype.substringData`]: {
      type: 'InstanceMethod',
      params: [['offset', num()], ['count', num()]],
      returns: str(),
      inherits: ['CharacterData'],
    },
  };
  return characterDataBuiltin;
}

const characterDataBuiltin = {
  ...inheritCharacterData('CharacterData'),
};

// MARK: ✅ NODE
function inheritNode(name: string) {
  const nodeBuiltin: Builtins = {
    ...inheritEventTarget(name),
    [`${name}.ELEMENT_NODE`]: {
      type: 'StaticProperty',
      params: [],
      returns: num(),
      inherits: ['Node'],
    },
    [`${name}.ATTRIBUTE_NODE`]: {
      type: 'StaticProperty',
      params: [],
      returns: num(),
      inherits: ['Node'],
    },
    [`${name}.TEXT_NODE`]: {
      type: 'StaticProperty',
      params: [],
      returns: num(),
      inherits: ['Node'],
    },
    [`${name}.CDATA_SECTION_NODE`]: {
      type: 'StaticProperty',
      params: [],
      returns: num(),
      inherits: ['Node'],
    },
    [`${name}.ENTITY_REFERENCE_NODE`]: {
      type: 'StaticProperty',
      params: [],
      returns: num(),
      inherits: ['Node'],
    },
    [`${name}.ENTITY_NODE`]: {
      type: 'StaticProperty',
      params: [],
      returns: num(),
      inherits: ['Node'],
    },
    [`${name}.PROCESSING_INSTRUCTION_NODE`]: {
      type: 'StaticProperty',
      params: [],
      returns: num(),
      inherits: ['Node'],
    },
    [`${name}.COMMENT_NODE`]: {
      type: 'StaticProperty',
      params: [],
      returns: num(),
      inherits: ['Node'],
    },
    [`${name}.DOCUMENT_NODE`]: {
      type: 'StaticProperty',
      params: [],
      returns: num(),
      inherits: ['Node'],
    },
    [`${name}.DOCUMENT_TYPE_NODE`]: {
      type: 'StaticProperty',
      params: [],
      returns: num(),
      inherits: ['Node'],
    },
    [`${name}.DOCUMENT_FRAGMENT_NODE`]: {
      type: 'StaticProperty',
      params: [],
      returns: num(),
      inherits: ['Node'],
    },
    [`${name}.NOTATION_NODE`]: {
      type: 'StaticProperty',
      params: [],
      returns: num(),
      inherits: ['Node'],
    },
    [`${name}.DOCUMENT_POSITION_DISCONNECTED`]: {
      type: 'StaticProperty',
      params: [],
      returns: num(),
      inherits: ['Node'],
    },
    [`${name}.DOCUMENT_POSITION_PRECEDING`]: {
      type: 'StaticProperty',
      params: [],
      returns: num(),
      inherits: ['Node'],
    },
    [`${name}.DOCUMENT_POSITION_FOLLOWING`]: {
      type: 'StaticProperty',
      params: [],
      returns: num(),
      inherits: ['Node'],
    },
    [`${name}.DOCUMENT_POSITION_CONTAINS`]: {
      type: 'StaticProperty',
      params: [],
      returns: num(),
      inherits: ['Node'],
    },
    [`${name}.DOCUMENT_POSITION_CONTAINED_BY`]: {
      type: 'StaticProperty',
      params: [],
      returns: num(),
      inherits: ['Node'],
    },
    [`${name}.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`]: {
      type: 'StaticProperty',
      params: [],
      returns: num(),
      inherits: ['Node'],
    },
  };
  return nodeBuiltin;
}

// TODO: Add correct params and returns
function inheritDocument(name: string): Builtins {
  const builtinText: Builtins = {
    [`${name}.new`]: {
      type: 'Constructor',
      params: [],
      returns: ctor('Text'),
      inherits: [],
    },
    [`${name}.prototype.assignedSlot`]: {
      type: 'InstanceProperty',
      params: [],
      returns: any(),
      inherits: [],
    },
    [`${name}.prototype.wholeText`]: {
      type: 'InstanceProperty',
      params: [],
      returns: any(),
      inherits: [],
    },
    [`${name}.prototype.splitText`]: {
      type: 'InstanceMethod',
      params: [],
      returns: any(),
      inherits: [],
    },
  };
  return builtinText;
}

const textBuiltin: Builtins = {
  ...inheritCharacterData('Text'),
};

const nodeBuiltin: Builtins = {
  ...inheritNode('Node'),
  ['Node.new']: {
    type: 'Constructor',
    params: [],
    returns: ctor('Node'),
    inherits: [],
  },
};

// MARK: ✅ ABORT CTRL
const abortControllerBuiltin: Builtins = {
  ['AbortController.new']: {
    type: 'Constructor',
    params: [],
    returns: ctor('AbortController'),
    inherits: [],
  },
  ['AbortController.prototype.signal']: {
    type: 'InstanceProperty',
    params: [],
    returns: ctor('AbortSignal'),
    inherits: [],
  },
  ['AbortController.prototype.abort']: {
    type: 'InstanceMethod',
    params: [['reason?', any()]],
    returns: undef(),
    inherits: ['AbortController'],
  },
};

// MARK: ✅ ABORT SIG
export const abortSignalBuiltin: Builtins = {
  ...inheritEventTarget('AbortSignal'),
  ['AbortSignal.aborted']: {
    type: 'InstanceProperty',
    params: [],
    returns: bool(),
    inherits: [],
  },
  ['AbortSignal.reason']: {
    type: 'InstanceProperty',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['AbortSignal.abort']: {
    type: 'StaticMethod',
    params: [['reason?', any()]],
    returns: ctor('AbortSignal'),
    inherits: [],
  },
  ['AbortSignal.any']: {
    type: 'StaticMethod',
    params: [['signals', arr(ctor('AbortSignal'))]],
    returns: ctor('AbortSignal'),
    inherits: [],
  },
  ['AbortSignal.timeout']: {
    type: 'StaticMethod',
    params: [['milliseconds', num()]],
    returns: ctor('AbortSignal'),
    inherits: [],
  },
  ['AbortSignal.prototype.throwIfAborted']: {
    type: 'InstanceMethod',
    params: [],
    returns: undef(),
    inherits: ['AbortSignal'],
  },
};

// MARK: ✅ ABST RANGE
const abstractRangeBuiltin = {
  ['AbstractRange.new']: {
    type: 'Constructor',
    params: [],
    returns: ctor('AbstractRange'),
    inherits: [],
  },
  ['AbstractRange.prototype.collapsed']: {
    type: 'InstanceProperty',
    params: [],
    returns: bool(),
    inherits: [],
  },
  ['AbstractRange.prototype.endContainer']: {
    type: 'InstanceProperty',
    params: [],
    returns: ctor('Node'),
    inherits: [],
  },
  ['AbstractRange.prototype.endOffset']: {
    type: 'InstanceProperty',
    params: [],
    returns: num(),
    inherits: [],
  },
  ['AbstractRange.prototype.startContainer']: {
    type: 'InstanceProperty',
    params: [],
    returns: ctor('Node'),
    inherits: [],
  },
  ['AbstractRange.prototype.startOffset']: {
    type: 'InstanceProperty',
    params: [],
    returns: num(),
    inherits: [],
  },
};

// MARK: ✅ ATTR
const attrBuiltin = {
  ...inheritNode('Attr'),
  ['Attr.prototype.localName']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['Attr.prototype.name']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['Attr.prototype.namespaceURI']: {
    type: 'InstanceProperty',
    params: [],
    returns: or(str(), nil()),
    inherits: [],
  },
  ['Attr.prototype.ownerDocument']: {
    type: 'InstanceProperty',
    params: [],
    returns: ctor('Document'),
    inherits: [],
  },
  ['Attr.prototype.ownerElement']: {
    type: 'InstanceProperty',
    params: [],
    returns: elOrNil(),
    inherits: [],
  },
  ['Attr.prototype.prefix']: {
    type: 'InstanceProperty',
    params: [],
    returns: or(str(), nil()),
    inherits: [],
  },
  ['Attr.prototype.value']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
};

// MARK: ✅ CDATA
const cdataSectionBuiltin = {
  ...inheritCharacterData('CDATASection'),
};

// MARK: ✅ COMMENT
const commentBuiltin = {
  ['Comment.new']: {
    type: 'Constructor',
    params: [],
    returns: ctor('Comment'),
    inherits: ['CharacterData'],
  },
};

// MARK: ✅ CUSTOM EVENT
const customEventBuiltin = {
  ...inheritEvent('CustomEvent'),
  ['CustomEvent.new']: {
    type: 'Constructor',
    params: [],
    returns: ctor('CustomEvent'),
    inherits: [],
  },
  ['CustomEvent.prototype.detail']: {
    type: 'InstanceProperty',
    params: [],
    returns: any(),
    inherits: [],
  },
};

const documentBuiltin: Builtins = {
  ...inheritNode('Document'),
  ['Document.new']: {
    type: 'Constructor',
    params: [],
    returns: ctor('Document'),
    inherits: [],
  },
  ['Document.prototype.activeElement']: {
    type: 'InstanceProperty',
    params: [],
    returns: union(ctor('Element'), nil()),
    inherits: [],
  },
  ['Document.prototype.adoptedStyleSheets']: {
    type: 'InstanceProperty',
    params: [],
    returns: arr(ctor('CSSStyleSheet')),
    inherits: [],
  },
  ['Document.prototype.body']: {
    type: 'InstanceProperty',
    params: [],
    returns: ctor('HTMLElement'),
    inherits: [],
  },
  ['Document.prototype.characterSet']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['Document.prototype.childElementCount']: {
    type: 'InstanceProperty',
    params: [],
    returns: num(),
    inherits: [],
  },
  ['Document.prototype.children']: {
    type: 'InstanceProperty',
    params: [],
    returns: ctor('HTMLCollection'),
    inherits: [],
  },
  ['Document.prototype.compatMode']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['Document.prototype.contentType']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['Document.prototype.cookie']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['Document.prototype.currentScript']: {
    type: 'InstanceProperty',
    params: [],
    returns: or(ctor('HTMLScriptElement'), ctor('SVGScriptElement')),
    inherits: [],
  },
  ['Document.prototype.defaultView']: {
    type: 'InstanceProperty',
    params: [],
    returns: or(and(ctor('Window'), ctor('globalThis')), nil()),
    inherits: [],
  },
  ['Document.prototype.designMode']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['Document.prototype.dir']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['Document.prototype.doctype']: {
    type: 'InstanceProperty',
    params: [],
    returns: or(ctor('DocumentType'), nil()),
    inherits: [],
  },
  ['Document.prototype.documentElement']: {
    type: 'InstanceProperty',
    params: [],
    returns: ctor('HTMLElement'),
    inherits: [],
  },
  ['Document.prototype.documentURI']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['Document.prototype.embeds']: {
    type: 'InstanceProperty',
    params: [],
    returns: htmlCollection(ctor('HTMLEmbedElement')),
    inherits: [],
  },
  ['Document.prototype.firstElementChild']: {
    type: 'InstanceProperty',
    params: [],
    returns: elOrNil(),
    inherits: [],
  },
  ['Document.prototype.fonts']: {
    type: 'InstanceProperty',
    params: [],
    returns: ctor('FontFaceSet'),
    inherits: [],
  },
  ['Document.prototype.forms']: {
    type: 'InstanceProperty',
    params: [],
    returns: htmlCollection(ctor('HTMLFormElement')),
    inherits: [],
  },
  ['Document.prototype.fragmentDirective']: {
    type: 'InstanceProperty',
    params: [],
    returns: ctor('FragmentDirective'),
    inherits: [],
  },
  ['Document.prototype.fullscreenElement']: {
    type: 'InstanceProperty',
    params: [],
    returns: elOrNil(),
    inherits: [],
  },
  ['Document.prototype.fullscreenEnabled']: {
    type: 'InstanceProperty',
    params: [],
    returns: bool(),
    inherits: [],
  },
  ['Document.prototype.head']: {
    type: 'InstanceProperty',
    params: [],
    returns: ctor('HTMLHeadElement'),
    inherits: [],
  },
  ['Document.prototype.hidden']: {
    type: 'InstanceProperty',
    params: [],
    returns: bool(),
    inherits: [],
  },
  ['Document.prototype.images']: {
    type: 'InstanceProperty',
    params: [],
    returns: htmlCollection(ctor('HTMLImageElement')),
    inherits: [],
  },
  ['Document.prototype.implementation']: {
    type: 'InstanceProperty',
    params: [],
    returns: ctor('DOMImplementation'),
    inherits: [],
  },
  ['Document.prototype.lastElementChild']: {
    type: 'InstanceProperty',
    params: [],
    returns: elOrNil(),
    inherits: [],
  },
  ['Document.prototype.lastModified']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['Document.prototype.links']: {
    type: 'InstanceProperty',
    params: [],
    returns: htmlCollection(or(ctor('HTMLAnchorElement'), ctor('HTMLAreaElement'))),
    inherits: [],
  },
  ['Document.prototype.location']: {
    type: 'InstanceProperty',
    params: [],
    returns: ctor('Location'),
    inherits: [],
  },
  ['Document.prototype.pictureInPictureElement']: {
    type: 'InstanceProperty',
    params: [],
    returns: elOrNil(),
    inherits: [],
  },
  ['Document.prototype.pictureInPictureEnabled']: {
    type: 'InstanceProperty',
    params: [],
    returns: bool(),
    inherits: [],
  },
  ['Document.prototype.plugins']: {
    type: 'InstanceProperty',
    params: [],
    returns: htmlCollection(ctor('HTMLEmbedElement')),
    inherits: [],
  },
  ['Document.prototype.pointerLockElement']: {
    type: 'InstanceProperty',
    params: [],
    returns: elOrNil(),
    inherits: [],
  },
  ['Document.prototype.readyState']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['Document.prototype.referrer']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['Document.prototype.scripts']: {
    type: 'InstanceProperty',
    params: [],
    returns: htmlCollection(ctor('HTMLScriptElement')),
    inherits: [],
  },
  ['Document.prototype.scrollingElement']: {
    type: 'InstanceProperty',
    params: [],
    returns: elOrNil(),
    inherits: [],
  },
  ['Document.prototype.styleSheets']: {
    type: 'InstanceProperty',
    params: [],
    returns: ctor('StyleSheetList'),
    inherits: [],
  },
  ['Document.prototype.timeline']: {
    type: 'InstanceProperty',
    params: [],
    returns: ctor('DocumentTimeline'),
    inherits: [],
  },
  ['Document.prototype.title']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['Document.prototype.URL']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['Document.parseHTMLUnsafe']: {
    type: 'StaticMethod',
    params: [['html', str()]],
    returns: ctor('Document'),
    inherits: [],
  },
  ['Document.prototype.adoptNode']: {
    // T extends Node
    type: 'InstanceMethod',
    params: [['node', ctor('Node')]], // T
    returns: ctor('Node'), // T
    inherits: [],
  },
  ['Document.prototype.append']: {
    type: 'InstanceMethod',
    params: [['...nodes', arr(or(ctor('Node'), str()))]],
    returns: undef(),
    inherits: [],
  },
  ['Document.prototype.caretPositionFromPoint']: {
    type: 'InstanceMethod',
    params: [['x', num()], ['y', num()], ['options?', obj()]], // CaretPositionFromPointOptions
    returns: or(ctor('CaretPosition'), nil()),
    inherits: [],
  },
  ['Document.prototype.close']: {
    type: 'InstanceMethod',
    params: [],
    returns: undef(),
    inherits: [],
  },
  ['Document.prototype.createAttribute']: {
    type: 'InstanceMethod',
    params: [['localName', str()]],
    returns: ctor('Attr'),
    inherits: [],
  },
  ['Document.prototype.createAttributeNS']: {
    type: 'InstanceMethod',
    params: [['namespace', or(str(), nil())], ['qualifiedName', str()]],
    returns: ctor('Attr'),
    inherits: [],
  },
  ['Document.prototype.createCDATASection']: {
    type: 'InstanceMethod',
    params: [['data', str()]],
    returns: ctor('CDATASection'),
    inherits: [],
  },
  ['Document.prototype.createComment']: {
    type: 'InstanceMethod',
    params: [['data', str()]],
    returns: ctor('Comment'),
    inherits: [],
  },
  ['Document.prototype.createDocumentFragment']: {
    type: 'InstanceMethod',
    params: [],
    returns: ctor('DocumentFragment'),
    inherits: [],
  },
  ['Document.prototype.createElement']: {
    type: 'InstanceMethod',
    params: [['tagName', htmlTagStrs()], ['options?', obj()]], // ElementCreationOptions
    returns: htmlEls(),
    inherits: [],
  },
  ['Document.prototype.createElementNS']: [
    {
      type: 'InstanceMethod',
      params: [['namespaceURI', str('http://www.w3.org/1999/xhtml')], ['qualifiedName', str()]],
      returns: ctor('HTMLElement'),
      inherits: [],
    },
    {
      type: 'InstanceMethod',
      params: [['namespaceURI', str('http://www.w3.org/2000/svg')], ['qualifiedName', svgTagStrs()]],
      returns: svgEls(),
      inherits: [],
    },
    {
      type: 'InstanceMethod',
      params: [['namespaceURI', str()], ['qualifiedName', ctor('SVGElement')]],
      returns: svgEls(),
      inherits: [],
    },
    {
      type: 'InstanceMethod',
      params: [['namespaceURI', str('http://www.w3.org/1998/Math/MathML')], ['qualifiedName', mathMlTagStrs()]],
      returns: ctor('MathMLElement'),
      inherits: [],
    },
    {
      type: 'InstanceMethod',
      params: [['namespaceURI', str('http://www.w3.org/1998/Math/MathML')], ['qualifiedName', str()]],
      returns: ctor('MathMLElement'),
      inherits: [],
    },
    {
      type: 'InstanceMethod',
      params: [['namespace', or(str(), nil())], ['qualifiedName', str()], ['options?', or(str(), obj())]], // ElementCreationOptions
      returns: ctor('Element'),
      inherits: [],
    },
  ],
  ['Document.prototype.createEvent']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.createExpression']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.createNodeIterator']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.createNSResolverDeprecated']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.createProcessingInstruction']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.createRange']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.createTextNode']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.createTouchNon-standardDeprecated']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.createTouchListNon-standardDeprecated']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.createTreeWalker']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.elementFromPoint']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.elementsFromPoint']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.enableStyleSheetsForSetNon-standardDeprecated']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.evaluate']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.execCommandDeprecated']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.exitFullscreen']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.exitPictureInPicture']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.exitPointerLock']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.getAnimations']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.getElementById']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.getElementsByClassName']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.getElementsByName']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.getElementsByTagName']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.getElementsByTagNameNS']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.getSelection']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.hasFocus']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.hasStorageAccess']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.hasUnpartitionedCookieAccess']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.importNode']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.open']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.prepend']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.queryCommandEnabledNon-standardDeprecated']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.queryCommandStateNon-standardDeprecated']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.queryCommandSupportedNon-standardDeprecated']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.querySelector']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.querySelectorAll']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.replaceChildren']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.requestStorageAccess']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.requestStorageAccessForExperimental']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.startViewTransition']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.write']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.prototype.writeln']: {
    type: 'InstanceMethod',
    params: [],
    returns: any(),
    inherits: [],
  },
  ['Document.copy']: {
    type: 'Event',
    params: [],
    returns: undef(),
    inherits: [],
  },
  ['Document.cut']: {
    type: 'Event',
    params: [],
    returns: undef(),
    inherits: [],
  },
  ['Document.DOMContentLoaded']: {
    type: 'Event',
    params: [],
    returns: undef(),
    inherits: [],
  },
  ['Document.fullscreenchange']: {
    type: 'Event',
    params: [],
    returns: undef(),
    inherits: [],
  },
  ['Document.fullscreenerror']: {
    type: 'Event',
    params: [],
    returns: undef(),
    inherits: [],
  },
  ['Document.paste']: {
    type: 'Event',
    params: [],
    returns: undef(),
    inherits: [],
  },
  ['Document.pointerlockchange']: {
    type: 'Event',
    params: [],
    returns: undef(),
    inherits: [],
  },
  ['Document.pointerlockerror']: {
    type: 'Event',
    params: [],
    returns: undef(),
    inherits: [],
  },
  ['Document.prerenderingchangeExperimental']: {
    type: 'Event',
    params: [],
    returns: undef(),
    inherits: [],
  },
  ['Document.readystatechange']: {
    type: 'Event',
    params: [],
    returns: undef(),
    inherits: [],
  },
  ['Document.scroll']: {
    type: 'Event',
    params: [],
    returns: undef(),
    inherits: [],
  },
  ['Document.scrollend']: {
    type: 'Event',
    params: [],
    returns: undef(),
    inherits: [],
  },
  ['Document.scrollsnapchangeExperimental']: {
    type: 'Event',
    params: [],
    returns: undef(),
    inherits: [],
  },
  ['Document.scrollsnapchangingExperimental']: {
    type: 'Event',
    params: [],
    returns: undef(),
    inherits: [],
  },
  ['Document.securitypolicyviolation']: {
    type: 'Event',
    params: [],
    returns: undef(),
    inherits: [],
  },
  ['Document.selectionchange']: {
    type: 'Event',
    params: [],
    returns: undef(),
    inherits: [],
  },
  ['Document.visibilitychange']: {
    type: 'Event',
    params: [],
    returns: undef(),
    inherits: [],
  },
};

const documentFragmentBuiltin = {
  ['DocumentFragment.new']: {
    type: 'Constructor',
    params: [],
    returns: new types.DocumentFragmentParameter(),
    inherits: [],
  },
  ['DocumentFragment.prototype.childElementCount']: {
    type: 'InstanceProperty',
    params: [],
    returns: num(),
    inherits: ['Node'],
  },
  ['DocumentFragment.prototype.children']: {
    type: 'InstanceProperty',
    params: [],
    returns: new types.HTMLCollectionParameter(),
    inherits: ['Node'],
  },
  ['DocumentFragment.prototype.firstElementChild']: {
    type: 'InstanceProperty',
    params: [],
    returns: new types.ElementParameter(),
    inherits: ['Node'],
  },
  ['DocumentFragment.prototype.lastElementChild']: {
    type: 'InstanceProperty',
    params: [],
    returns: new types.ElementParameter(),
    inherits: ['Node'],
  },
  ['DocumentFragment.prototype.append']: {
    type: 'InstanceMethod',
    params: [new types.VariadicParameter(types.NodeParameter)],
    returns: new types.VoidParameter(),
    inherits: ['Node'],
  },
  ['DocumentFragment.prototype.getElementById']: {
    type: 'InstanceMethod',
    params: [str()],
    returns: new types.ElementParameter(),
    inherits: ['Node'],
  },
  ['DocumentFragment.prototype.prepend']: {
    type: 'InstanceMethod',
    params: [new types.VariadicParameter(types.NodeParameter)],
    returns: new types.VoidParameter(),
    inherits: ['Node'],
  },
  ['DocumentFragment.prototype.querySelector']: {
    type: 'InstanceMethod',
    params: [str()],
    returns: new types.ElementParameter(),
    inherits: ['Node'],
  },
  ['DocumentFragment.prototype.querySelectorAll']: {
    type: 'InstanceMethod',
    params: [str()],
    returns: new types.NodeListParameter(),
    inherits: ['Node'],
  },
  ['DocumentFragment.prototype.replaceChildren']: {
    type: 'InstanceMethod',
    params: [new types.VariadicParameter(types.NodeParameter)],
    returns: new types.VoidParameter(),
    inherits: ['Node'],
  },
};

const documentTypeBuiltin = {
  // Inherits Node, EventTarget
  ['DocumentType.prototype.name']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['DocumentType.prototype.publicId']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['DocumentType.prototype.systemId']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['DocumentType.prototype.after']: {
    type: 'InstanceMethod',
    params: [['node', new types.NodeParameter()]],
    returns: undef(),
    inherits: [],
  },
  ['DocumentType.prototype.before']: {
    type: 'InstanceMethod',
    params: [['node', new types.NodeParameter()]],
    returns: undef(),
    inherits: [],
  },
  ['DocumentType.prototype.remove']: {
    type: 'InstanceMethod',
    params: [],
    returns: undef(),
    inherits: [],
  },
  ['DocumentType.prototype.replaceWith']: {
    type: 'InstanceMethod',
    params: [['node', new types.NodeParameter()]],
    returns: undef(),
    inherits: [],
  },
};

const domExceptionBuiltin = {
  ['DOMException.new']: {
    type: 'Constructor',
    params: [],
    returns: ctor('DOMException'),
    inherits: [],
  },
  ['DOMException.prototype.codeDeprecated']: {
    type: 'InstanceProperty',
    params: [],
    returns: num(), // Assuming code is a number
    inherits: [],
  },
  ['DOMException.prototype.message']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['DOMException.prototype.name']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
};

const domImplementationBuiltin = {
  // Constructor (none specified for DOMImplementation)

  // Instance methods
  ['DOMImplementation.prototype.createDocument']: {
    type: 'InstanceMethod',
    params: [['namespaceURI', str()], ['qualifiedName', str()], [
      'doctype',
      obj(),
    ]], // Example parameter types
    returns: obj(), // Assume the return is a Document
    inherits: [],
  },
  ['DOMImplementation.prototype.createDocumentType']: {
    type: 'InstanceMethod',
    params: [['qualifiedName', str()], ['publicId', str()], [
      'systemId',
      str(),
    ]],
    returns: obj(), // Assume the return is a DocumentType
    inherits: [],
  },
  ['DOMImplementation.prototype.createHTMLDocument']: {
    type: 'InstanceMethod',
    params: [['title', str()]],
    returns: obj(), // Assume the return is an HTMLDocument
    inherits: [],
  },
  // Static methods (none specified for DOMImplementation)
  // Static properties (none specified for DOMImplementation)
  // Events (none specified for DOMImplementation)
  // Inheritance
  // Inherits: None
};

const domParserBuiltin = {
  // Constructor
  ['DOMParser.new']: {
    type: 'Constructor',
    params: [], // No parameters for the DOMParser constructor
    returns: ctor('DOMParser'),
    inherits: [],
  },

  // Instance methods
  ['DOMParser.prototype.parseFromString']: {
    type: 'InstanceMethod',
    params: [['string', str()], ['mimeType', str()]], // Example params: string to parse and mimeType
    returns: obj(), // Assume return value is a Document object
    inherits: [],
  },
  // Static methods (none specified for DOMParser)

  // Static properties (none specified for DOMParser)

  // Events (none specified for DOMParser)

  // Inheritance
  // Inherits: None
};

const domPointBuiltin = {
  // Constructor
  ['DOMPoint.new']: {
    type: 'Constructor',
    params: [], // No parameters for the DOMPoint constructor
    returns: ctor('DOMPoint'),
    inherits: [],
  },

  // Instance properties
  ['DOMPoint.prototype.w']: {
    type: 'InstanceProperty',
    params: [], // Properties do not have parameters
    returns: num(), // Assume 'w' is a numeric value
    inherits: [],
  },
  ['DOMPoint.prototype.x']: {
    type: 'InstanceProperty',
    params: [],
    returns: num(), // Assume 'x' is a numeric value
    inherits: [],
  },
  ['DOMPoint.prototype.y']: {
    type: 'InstanceProperty',
    params: [],
    returns: num(), // Assume 'y' is a numeric value
    inherits: [],
  },
  ['DOMPoint.prototype.z']: {
    type: 'InstanceProperty',
    params: [],
    returns: num(), // Assume 'z' is a numeric value
    inherits: [],
  },

  // Static methods
  ['DOMPoint.fromPoint']: {
    type: 'StaticMethod',
    params: [['point', obj()]], // Assume fromPoint takes a point-like object as a parameter
    returns: obj(), // Assume the return value is a DOMPoint object
    inherits: [],
  },
  // Inheritance
  // Inherits: DOMPointReadOnly
};

const domPointReadOnlyBuiltin = {
  // Constructor
  ['DOMPointReadOnly.new']: {
    type: 'Constructor',
    params: [], // No parameters for the DOMPointReadOnly constructor
    returns: ctor('DOMPointReadOnly'),
    inherits: [],
  },

  // Instance properties
  ['DOMPointReadOnly.prototype.w']: {
    type: 'InstanceProperty',
    params: [], // Properties do not have parameters
    returns: num(), // Assume 'w' is a numeric value
    inherits: [],
  },
  ['DOMPointReadOnly.prototype.x']: {
    type: 'InstanceProperty',
    params: [],
    returns: num(), // Assume 'x' is a numeric value
    inherits: [],
  },
  ['DOMPointReadOnly.prototype.y']: {
    type: 'InstanceProperty',
    params: [],
    returns: num(), // Assume 'y' is a numeric value
    inherits: [],
  },
  ['DOMPointReadOnly.prototype.z']: {
    type: 'InstanceProperty',
    params: [],
    returns: num(), // Assume 'z' is a numeric value
    inherits: [],
  },

  // Static methods
  ['DOMPointReadOnly.fromPoint']: {
    type: 'StaticMethod',
    params: [['point', obj()]], // Assume fromPoint takes a point-like object as a parameter
    returns: obj(), // Assume the return value is a DOMPointReadOnly object
    inherits: [],
  },

  // Instance methods
  ['DOMPointReadOnly.prototype.toJSON']: {
    type: 'InstanceMethod',
    params: [], // No parameters for toJSON
    returns: obj(), // Assume it returns an object
    inherits: [],
  },
  // Inheritance
  // No direct inheritance for DOMPointReadOnly
};

const domTokenListBuiltin = {
  ['DOMTokenList.prototype.length']: {
    type: 'InstanceProperty',
    params: [],
    returns: num(),
    inherits: [],
  },
  ['DOMTokenList.prototype.value']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['DOMTokenList.prototype.add']: {
    type: 'InstanceMethod',
    params: [['tokens', arr(str())]],
    returns: undef(),
    inherits: [],
  },
  ['DOMTokenList.prototype.contains']: {
    type: 'InstanceMethod',
    params: [['token', str()]],
    returns: bool(),
    inherits: [],
  },
  ['DOMTokenList.prototype.entries']: {
    type: 'InstanceMethod',
    params: [],
    returns: iter(
      new types.TupleParam(num(), str()),
    ),
    inherits: [],
  },
  ['DOMTokenList.prototype.forEach']: {
    type: 'InstanceMethod',
    params: [
      ['callbackfn', fn()],
      ['thisArg', any()],
    ],
    returns: undef(),
    inherits: [],
  },
  ['DOMTokenList.prototype.item']: {
    type: 'InstanceMethod',
    params: [['index', num()]],
    returns: or(str(), nil()),
    inherits: [],
  },
  ['DOMTokenList.prototype.keys']: {
    type: 'InstanceMethod',
    params: [],
    returns: iter(num()),
    inherits: [],
  },
  ['DOMTokenList.prototype.remove']: {
    type: 'InstanceMethod',
    params: [['tokens', arr(str())]],
    returns: undef(),
    inherits: [],
  },
  ['DOMTokenList.prototype.replace']: {
    type: 'InstanceMethod',
    params: [
      ['oldToken', str()],
      ['newToken', str()],
    ],
    returns: bool(),
    inherits: [],
  },
  ['DOMTokenList.prototype.supports']: {
    type: 'InstanceMethod',
    params: [['token', str()]],
    returns: bool(),
    inherits: [],
  },
  ['DOMTokenList.prototype.toggle']: {
    type: 'InstanceMethod',
    params: [
      ['token', str()],
      ['force', bool()],
    ],
    returns: bool(),
    inherits: [],
  },
  ['DOMTokenList.prototype.values']: {
    type: 'InstanceMethod',
    params: [],
    returns: iter(str()),
    inherits: [],
  },
};

const elementBuiltin = {
  // Inherits: Node, EventTarget
  ...ariaMixin('Element'),
  // Instance Properties

  ['Element.prototype.assignedSlot']: {
    type: 'InstanceProperty',
    params: [],
    returns: or(
      ctor('HTMLSlotElement'),
      nil(),
    ),
    inherits: [],
  },
  ['Element.prototype.attributes']: {
    type: 'InstanceProperty',
    params: [],
    returns: ctor('NamedNodeMap'),
    inherits: [],
  },
  ['Element.prototype.childElementCount']: {
    type: 'InstanceProperty',
    params: [],
    returns: num(),
    inherits: [],
  },
  ['Element.prototype.children']: {
    type: 'InstanceProperty',
    params: [],
    returns: ctor('HTMLCollection'),
    inherits: [],
  },
  ['Element.prototype.classList']: {
    type: 'InstanceProperty',
    params: [],
    returns: ctor('DOMTokenList'),
    inherits: [],
  },
  ['Element.prototype.className']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['Element.prototype.clientHeight']: {
    type: 'InstanceProperty',
    params: [],
    returns: num(),
    inherits: [],
  },
  ['Element.prototype.clientLeft']: {
    type: 'InstanceProperty',
    params: [],
    returns: num(),
    inherits: [],
  },
  ['Element.prototype.clientTop']: {
    type: 'InstanceProperty',
    params: [],
    returns: num(),
    inherits: [],
  },
  ['Element.prototype.clientWidth']: {
    type: 'InstanceProperty',
    params: [],
    returns: num(),
    inherits: [],
  },
  ['Element.prototype.currentCSSZoom']: {
    type: 'InstanceProperty',
    params: [],
    returns: num(), // Experimental
    inherits: [],
  },
  // ['Element.prototype.elementTiming']: {
  //   type: 'InstanceProperty',
  //   params: [],
  //   returns: new types.StringParameter(), // Experimental
  //   inherits: [],
  // },
  ['Element.prototype.firstElementChild']: {
    type: 'InstanceProperty',
    params: [],
    returns: or(
      ctor('Element'),
      nil(),
    ),
    inherits: [],
  },
  ['Element.prototype.id']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['Element.prototype.innerHTML']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['Element.prototype.lastElementChild']: {
    type: 'InstanceProperty',
    params: [],
    returns: or(
      ctor('Element'),
      nil(),
    ),
    inherits: [],
  },
  ['Element.prototype.localName']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['Element.prototype.namespaceURI']: {
    type: 'InstanceProperty',
    params: [],
    returns: or(str(), nil()),
    inherits: [],
  },
  ['Element.prototype.nextElementSibling']: {
    type: 'InstanceProperty',
    params: [],
    returns: or(
      ctor('Element'),
      nil(),
    ),
    inherits: [],
  },
  ['Element.prototype.outerHTML']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['Element.prototype.part']: {
    type: 'InstanceProperty',
    params: [],
    returns: ctor('DOMTokenList'),
    inherits: [],
  },
  ['Element.prototype.prefix']: {
    type: 'InstanceProperty',
    params: [],
    returns: or(str(), nil()),
    inherits: [],
  },
  ['Element.prototype.previousElementSibling']: {
    type: 'InstanceProperty',
    params: [],
    returns: or(
      ctor('Element'),
      nil(),
    ),
    inherits: [],
  },
  ['Element.prototype.scrollHeight']: {
    type: 'InstanceProperty',
    params: [],
    returns: num(),
    inherits: [],
  },
  ['Element.prototype.scrollLeft']: {
    type: 'InstanceProperty',
    params: [],
    returns: num(),
    inherits: [],
  },
  ['Element.prototype.scrollTop']: {
    type: 'InstanceProperty',
    params: [],
    returns: num(),
    inherits: [],
  },
  ['Element.prototype.scrollWidth']: {
    type: 'InstanceProperty',
    params: [],
    returns: num(),
    inherits: [],
  },
  ['Element.prototype.shadowRoot']: {
    type: 'InstanceProperty',
    params: [],
    returns: or(
      ctor('ShadowRoot'),
      nil(),
    ),
    inherits: [],
  },
  ['Element.prototype.slot']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['Element.prototype.tagName']: {
    type: 'InstanceProperty',
    params: [],
    returns: str(),
    inherits: [],
  },

  // Instance Methods
  ['Element.prototype.after']: {
    type: 'InstanceMethod',
    params: [[
      '...nodes',
      arr(
        or(
          ctor('Node'),
          str(),
        ),
      ),
    ]],
    returns: undef(),
    inherits: [],
  },
  ['Element.prototype.animate']: {
    type: 'InstanceMethod',
    params: [
      [
        'keyframes',
        or(
          arr(obj()), /* Keyframe */
          obj(), /* PropertyIndexedKeyframes */
          nil(),
        ),
      ],
      [
        'options?',
        or(
          num(),
          obj(), /* KeyframeAnimationOptions */
        ),
      ],
    ],
    returns: ctor('Animation'),
    inherits: [],
  },
  ['Element.prototype.append']: {
    type: 'InstanceMethod',
    params: [['...nodes', arr(or(any()))]],
    returns: undef(),
    inherits: [],
  },
  ['Element.prototype.attachShadow']: {
    type: 'InstanceMethod',
    params: [['shadowRootInit', obj()]], // ShadowRootInit dictionary
    returns: obj(), // ShadowRoot
    inherits: [],
  },
  ['Element.prototype.before']: {
    type: 'InstanceMethod',
    params: [['...nodes', arr(any())]],
    returns: undef(),
    inherits: [],
  },
  ['Element.prototype.checkVisibility']: {
    type: 'InstanceMethod',
    params: [['options', obj()]], // Optional
    returns: bool(),
    inherits: [],
  },
  ['Element.prototype.closest']: {
    type: 'InstanceMethod',
    params: [['selectors', str()]],
    returns: or(obj(), nil()), // Element | null
    inherits: [],
  },
  ['Element.prototype.computedStyleMap']: {
    type: 'InstanceMethod',
    params: [],
    returns: obj(), // StylePropertyMapReadOnly
    inherits: [],
  },
  ['Element.prototype.getAnimations']: {
    type: 'InstanceMethod',
    params: [],
    returns: arr(obj()), // Array of Animation objects
    inherits: [],
  },
  ['Element.prototype.getAttribute']: {
    type: 'InstanceMethod',
    params: [['name', str()]],
    returns: or(str(), nil()),
    inherits: [],
  },
  ['Element.prototype.getAttributeNames']: {
    type: 'InstanceMethod',
    params: [],
    returns: arr(str()),
    inherits: [],
  },
  ['Element.prototype.getAttributeNode']: {
    type: 'InstanceMethod',
    params: [['name', str()]],
    returns: or(obj(), nil()), // Attr | null
    inherits: [],
  },
  ['Element.prototype.getAttributeNodeNS']: {
    type: 'InstanceMethod',
    params: [['namespace', str()], ['localName', str()]],
    returns: or(obj(), nil()), // Attr | null
    inherits: [],
  },
  ['Element.prototype.getAttributeNS']: {
    type: 'InstanceMethod',
    params: [['namespace', str()], ['localName', str()]],
    returns: or(str(), nil()),
    inherits: [],
  },
  ['Element.prototype.getBoundingClientRect']: {
    type: 'InstanceMethod',
    params: [],
    returns: obj(), // DOMRect
    inherits: [],
  },
  ['Element.prototype.getClientRects']: {
    type: 'InstanceMethod',
    params: [],
    returns: obj(), // DOMRectList
    inherits: [],
  },
  ['Element.prototype.getElementsByClassName']: {
    type: 'InstanceMethod',
    params: [['classNames', str()]],
    returns: obj(), // HTMLCollection
    inherits: [],
  },
  ['Element.prototype.getElementsByTagName']: {
    type: 'InstanceMethod',
    params: [['tagName', str()]],
    returns: obj(), // HTMLCollection
    inherits: [],
  },
  ['Element.prototype.getElementsByTagNameNS']: {
    type: 'InstanceMethod',
    params: [['namespace', str()], ['localName', str()]],
    returns: obj(), // HTMLCollection
    inherits: [],
  },
  ['Element.prototype.getHTML']: {
    type: 'InstanceMethod',
    params: [],
    returns: str(),
    inherits: [],
  },
  ['Element.prototype.hasAttribute']: {
    type: 'InstanceMethod',
    params: [['name', str()]],
    returns: bool(),
    inherits: [],
  },
  ['Element.prototype.hasAttributeNS']: {
    type: 'InstanceMethod',
    params: [['namespace', str()], ['localName', str()]],
    returns: bool(),
    inherits: [],
  },
  ['Element.prototype.hasAttributes']: {
    type: 'InstanceMethod',
    params: [],
    returns: bool(),
    inherits: [],
  },
  ['Element.prototype.hasPointerCapture']: {
    type: 'InstanceMethod',
    params: [['pointerId', num()]],
    returns: bool(),
    inherits: [],
  },
  ['Element.prototype.insertAdjacentElement']: {
    type: 'InstanceMethod',
    params: [['position', str()], ['element', obj()]], // Element
    returns: or(obj(), nil()),
    inherits: [],
  },
  ['Element.prototype.insertAdjacentHTML']: {
    type: 'InstanceMethod',
    params: [['position', str()], ['text', str()]],
    returns: undef(),
    inherits: [],
  },
  ['Element.prototype.insertAdjacentText']: {
    type: 'InstanceMethod',
    params: [['position', str()], ['text', str()]],
    returns: undef(),
    inherits: [],
  },
  ['Element.prototype.matches']: {
    type: 'InstanceMethod',
    params: [['selectors', str()]],
    returns: bool(),
    inherits: [],
  },
  ['Element.prototype.prepend']: {
    type: 'InstanceMethod',
    params: [['...nodes', arr(any())]],
    returns: undef(),
    inherits: [],
  },
  ['Element.prototype.querySelector']: {
    type: 'InstanceMethod',
    params: [['selectors', str()]],
    returns: or(obj(), nil()), // Element | null
    inherits: [],
  },
  ['Element.prototype.querySelectorAll']: {
    type: 'InstanceMethod',
    params: [['selectors', str()]],
    returns: obj(), // NodeList
    inherits: [],
  },
  ['Element.prototype.releasePointerCapture']: {
    type: 'InstanceMethod',
    params: [['pointerId', num()]],
    returns: undef(),
    inherits: [],
  },
  ['Element.prototype.remove']: {
    type: 'InstanceMethod',
    params: [],
    returns: undef(),
    inherits: [],
  },
  ['Element.prototype.removeAttribute']: {
    type: 'InstanceMethod',
    params: [['name', str()]],
    returns: undef(),
    inherits: [],
  },
  ['Element.prototype.removeAttributeNode']: {
    type: 'InstanceMethod',
    params: [['attr', obj()]], // Attr
    returns: obj(), // Attr
    inherits: [],
  },
  ['Element.prototype.removeAttributeNS']: {
    type: 'InstanceMethod',
    params: [['namespace', str()], ['localName', str()]],
    returns: undef(),
    inherits: [],
  },
  ['Element.prototype.replaceChildren']: {
    type: 'InstanceMethod',
    params: [['...nodes', arr(any())]],
    returns: undef(),
    inherits: [],
  },
  ['Element.prototype.replaceWith']: {
    type: 'InstanceMethod',
    params: [['...nodes', arr(any())]],
    returns: undef(),
    inherits: [],
  },
  ['Element.prototype.requestFullscreen']: {
    type: 'InstanceMethod',
    params: [],
    returns: new types.PromiseParam(undef()),
    inherits: [],
  },
  ['Element.prototype.requestPointerLock']: {
    type: 'InstanceMethod',
    params: [],
    returns: undef(),
    inherits: [],
  },
  ['Element.prototype.scroll']: {
    type: 'InstanceMethod',
    params: [['options', obj()]],
    returns: undef(),
    inherits: [],
  },
  ['Element.prototype.scrollBy']: {
    type: 'InstanceMethod',
    params: [['options', obj()]],
    returns: undef(),
    inherits: [],
  },
  ['Element.prototype.scrollIntoView']: {
    type: 'InstanceMethod',
    params: [['arg', or(bool(), obj())]],
    returns: undef(),
    inherits: [],
  },
  ['Element.prototype.scrollIntoViewIfNeeded']: {
    type: 'InstanceMethod',
    params: [['centerIfNeeded', bool()]], // Non-standard
    returns: undef(),
    inherits: [],
  },
  ['Element.prototype.scrollTo']: {
    type: 'InstanceMethod',
    params: [['options', obj()]],
    returns: undef(),
    inherits: [],
  },
  ['Element.prototype.setAttribute']: {
    type: 'InstanceMethod',
    params: [['name', str()], ['value', str()]],
    returns: undef(),
    inherits: [],
  },
  ['Element.prototype.setAttributeNode']: {
    type: 'InstanceMethod',
    params: [['attr', obj()]], // Attr
    returns: obj(), // Attr
    inherits: [],
  },
  ['Element.prototype.setAttributeNodeNS']: {
    type: 'InstanceMethod',
    params: [['attr', obj()]], // Attr
    returns: obj(), // Attr
    inherits: [],
  },
  ['Element.prototype.setAttributeNS']: {
    type: 'InstanceMethod',
    params: [['namespace', str()], ['qualifiedName', str()], [
      'value',
      str(),
    ]],
    returns: undef(),
    inherits: [],
  },
  // ['Element.prototype.setCapture']: {
  //   type: 'InstanceMethod',
  //   params: [['retargetToElement', bool()]], // Non-standard, Deprecated
  //   returns: undef(),
  //   inherits: [],
  // },
  ['Element.prototype.setHTMLUnsafe']: {
    type: 'InstanceMethod',
    params: [['html', str()]],
    returns: undef(),
    inherits: [],
  },
  ['Element.prototype.setPointerCapture']: {
    type: 'InstanceMethod',
    params: [['pointerId', num()]],
    returns: undef(),
    inherits: [],
  },
  ['Element.prototype.toggleAttribute']: {
    type: 'InstanceMethod',
    params: [['name', str()], ['force', bool()]],
    returns: bool(),
    inherits: [],
  },
};

export const htmlDefinitions = {
  ...eventTargetBuiltin,
  ...nodeBuiltin,
  ...textBuiltin,
  ...characterDataBuiltin,
  ...abortControllerBuiltin,
  ...abortSignalBuiltin,
  ...abstractRangeBuiltin,
  ...attrBuiltin,
  ...cdataSectionBuiltin,
  ...commentBuiltin,
  ...builtinEvent,
  ...customEventBuiltin,
};

function union(arg0: types.CtorParam, arg1: types.NullParam): types.ParamType {
  throw new Error('Function not implemented.');
}
