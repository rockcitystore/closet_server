/**
 * Created by bar on 2/24/16.
 */
var xss = require('xss');


//href\src\background 规则 见 \node_modules\xss\lib\default.js safeAttrValue()
// 仅允许 http:// | https:// | mailto: | / | # 开头的地址
module.exports =  function (html){
 var options = {
  stripIgnoreTag:true
  ,stripIgnoreTagAttr:true
  , whiteList:{a:      ['target', 'href', 'title'],
   abbr:   ['title'],
   address: [],
   area:   ['shape', 'coords', 'href', 'alt'],
   article: [],
   aside:  [],
   audio:  ['autoplay', 'controls', 'loop', 'preload', 'src'],
   b:      [],
   bdi:    ['dir'],
   bdo:    ['dir'],
   big:    [],
   blockquote: ['cite'],
   br:     [],
   caption: [],
   center: [],
   cite:   [],
   code:   [],
   col:    ['align', 'valign', 'span', 'width'],
   colgroup: ['align', 'valign', 'span', 'width'],
   dd:     [],
   del:    ['datetime'],
   details: ['open'],
   div:    [],
   dl:     [],
   dt:     [],
   em:     [],
   font:   ['color', 'size', 'face'],
   footer: [],
   h1:     [],
   h2:     [],
   h3:     [],
   h4:     [],
   h5:     [],
   h6:     [],
   header: [],
   hr:     [],
   i:      [],
   img:    ['src', 'alt', 'title', 'width', 'height'],
   ins:    ['datetime'],
   li:     [],
   mark:   [],
   nav:    [],
   ol:     [],
   p:      ['style'],
   pre:    [],
   s:      [],
   section:[],
   small:  [],
   span:   [],
   sub:    [],
   sup:    [],
   strong: [],
   table:  ['width', 'border', 'align', 'valign'],
   tbody:  ['align', 'valign'],
   td:     ['width', 'colspan', 'align', 'valign'],
   tfoot:  ['align', 'valign'],
   th:     ['width', 'colspan', 'align', 'valign'],
   thead:  ['align', 'valign'],
   tr:     ['rowspan', 'align', 'valign'],
   tt:     [],
   u:      [],
   ul:     [],
   video:  ['autoplay', 'controls', 'loop', 'preload', 'src', 'height', 'width']
  }//HTML标签白名单
  ,css:cw//CSS属性白名单
 };
 return xss(html,options)
};

var cw ={whiteList:{
 'align-content':false, // default: auto
 'align-items':false, // default: auto
 'align-self':false, // default: auto
 'alignment-adjust':false, // default: auto
 'alignment-baseline':false, // default: baseline
 'all':false, // default: depending on individual properties
 'anchor-point':false, // default: none
 'animation':false, // default: depending on individual properties
 'animation-delay':false, // default: 0
 'animation-direction':false, // default: normal
 'animation-duration':false, // default: 0
 'animation-fill-mode':false, // default: none
 'animation-iteration-count':false, // default: 1
 'animation-name':false, // default: none
 'animation-play-state':false, // default: running
 'animation-timing-function':false, // default: ease
 'azimuth':false, // default: center
 'backface-visibility':false, // default: visible
 'background':true, // default: depending on individual properties
 'background-attachment':true, // default: scroll
 'background-clip':true, // default: border-box
 'background-color':true, // default: transparent
 'background-image':true, // default: none
 'background-origin':true, // default: padding-box
 'background-position':true, // default: 0% 0%
 'background-repeat':true, // default: repeat
 'background-size':true, // default: auto
 'baseline-shift':false, // default: baseline
 'binding':false, // default: none
 'bleed':false, // default: 6pt
 'bookmark-label':false, // default: content()
 'bookmark-level':false, // default: none
 'bookmark-state':false, // default: open
 'border':true, // default: depending on individual properties
 'border-bottom':true, // default: depending on individual properties
 'border-bottom-color':true, // default: current color
 'border-bottom-left-radius':true, // default: 0
 'border-bottom-right-radius':true, // default: 0
 'border-bottom-style':true, // default: none
 'border-bottom-width':true, // default: medium
 'border-collapse':true, // default: separate
 'border-color':true, // default: depending on individual properties
 'border-image':true, // default: none
 'border-image-outset':true, // default: 0
 'border-image-repeat':true, // default: stretch
 'border-image-slice':true, // default: 100%
 'border-image-source':true, // default: none
 'border-image-width':true, // default: 1
 'border-left':true, // default: depending on individual properties
 'border-left-color':true, // default: current color
 'border-left-style':true, // default: none
 'border-left-width':true, // default: medium
 'border-radius':true, // default: 0
 'border-right':true, // default: depending on individual properties
 'border-right-color':true, // default: current color
 'border-right-style':true, // default: none
 'border-right-width':true, // default: medium
 'border-spacing':true, // default: 0
 'border-style':true, // default: depending on individual properties
 'border-top':true, // default: depending on individual properties
 'border-top-color':true, // default: current color
 'border-top-left-radius':true, // default: 0
 'border-top-right-radius':true, // default: 0
 'border-top-style':true, // default: none
 'border-top-width':true, // default: medium
 'border-width':true, // default: depending on individual properties
 'bottom':false, // default: auto
 'box-decoration-break':true, // default: slice
 'box-shadow':true, // default: none
 'box-sizing':true, // default: content-box
 'box-snap':true, // default: none
 'box-suppress':true, // default: show
 'break-after':true, // default: auto
 'break-before':true, // default: auto
 'break-inside':true, // default: auto
 'caption-side':false, // default: top
 'chains':false, // default: none
 'clear':true, // default: none
 'clip':false, // default: auto
 'clip-path':false, // default: none
 'clip-rule':false, // default: nonzero
 'color':true, // default: implementation dependent
 'color-interpolation-filters':true, // default: auto
 'column-count':false, // default: auto
 'column-fill':false, // default: balance
 'column-gap':false, // default: normal
 'column-rule':false, // default: depending on individual properties
 'column-rule-color':false, // default: current color
 'column-rule-style':false, // default: medium
 'column-rule-width':false, // default: medium
 'column-span':false, // default: none
 'column-width':false, // default: auto
 'columns':false, // default: depending on individual properties
 'contain':false, // default: none
 'content':false, // default: normal
 'counter-increment':false, // default: none
 'counter-reset':false, // default: none
 'counter-set':false, // default: none
 'crop':false, // default: auto
 'cue':false, // default: depending on individual properties
 'cue-after':false, // default: none
 'cue-before':false, // default: none
 'cursor':false, // default: auto
 'direction':false, // default: ltr
 'display':true, // default: depending on individual properties
 'display-inside':true, // default: auto
 'display-list':true, // default: none
 'display-outside':true, // default: inline-level
 'dominant-baseline':false, // default: auto
 'elevation':false, // default: level
 'empty-cells':false, // default: show
 'filter':false, // default: none
 'flex':false, // default: depending on individual properties
 'flex-basis':false, // default: auto
 'flex-direction':false, // default: row
 'flex-flow':false, // default: depending on individual properties
 'flex-grow':false, // default: 0
 'flex-shrink':false, // default: 1
 'flex-wrap':false, // default: nowrap
 'float':false, // default: none
 'float-offset':false, // default: 0 0
 'flood-color':false, // default: black
 'flood-opacity':false, // default: 1
 'flow-from':false, // default: none
 'flow-into':false, // default: none
 'font':true, // default: depending on individual properties
 'font-family':true, // default: implementation dependent
 'font-feature-settings':true, // default: normal
 'font-kerning':true, // default: auto
 'font-language-override':true, // default: normal
 'font-size':true, // default: medium
 'font-size-adjust':true, // default: none
 'font-stretch':true, // default: normal
 'font-style':true, // default: normal
 'font-synthesis':true, // default: weight style
 'font-variant':true, // default: normal
 'font-variant-alternates':true, // default: normal
 'font-variant-caps':true, // default: normal
 'font-variant-east-asian':true, // default: normal
 'font-variant-ligatures':true, // default: normal
 'font-variant-numeric':true, // default: normal
 'font-variant-position':true, // default: normal
 'font-weight':true, // default: normal
 'grid':false, // default: depending on individual properties
 'grid-area':false, // default: depending on individual properties
 'grid-auto-columns':false, // default: auto
 'grid-auto-flow':false, // default: none
 'grid-auto-rows':false, // default: auto
 'grid-column':false, // default: depending on individual properties
 'grid-column-end':false, // default: auto
 'grid-column-start':false, // default: auto
 'grid-row':false, // default: depending on individual properties
 'grid-row-end':false, // default: auto
 'grid-row-start':false, // default: auto
 'grid-template':false, // default: depending on individual properties
 'grid-template-areas':false, // default: none
 'grid-template-columns':false, // default: none
 'grid-template-rows':false, // default: none
 'hanging-punctuation':false, // default: none
 'height':true, // default: auto
 'hyphens':false, // default: manual
 'icon':false, // default: auto
 'image-orientation':false, // default: auto
 'image-resolution':false, // default: normal
 'ime-mode':false, // default: auto
 'initial-letters':false, // default: normal
 'inline-box-align':false, // default: last
 'justify-content':false, // default: auto
 'justify-items':false, // default: auto
 'justify-self':false, // default: auto
 'left':false, // default: auto
 'letter-spacing':true, // default: normal
 'lighting-color':true, // default: white
 'line-box-contain':false, // default: block inline replaced
 'line-break':false, // default: auto
 'line-grid':false, // default: match-parent
 'line-height':false, // default: normal
 'line-snap':false, // default: none
 'line-stacking':false, // default: depending on individual properties
 'line-stacking-ruby':false, // default: exclude-ruby
 'line-stacking-shift':false, // default: consider-shifts
 'line-stacking-strategy':false, // default: inline-line-height
 'list-style':true, // default: depending on individual properties
 'list-style-image':true, // default: none
 'list-style-position':true, // default: outside
 'list-style-type':true, // default: disc
 'margin':true, // default: depending on individual properties
 'margin-bottom':true, // default: 0
 'margin-left':true, // default: 0
 'margin-right':true, // default: 0
 'margin-top':true, // default: 0
 'marker-offset':false, // default: auto
 'marker-side':false, // default: list-item
 'marks':false, // default: none
 'mask':false, // default: border-box
 'mask-box':false, // default: see individual properties
 'mask-box-outset':false, // default: 0
 'mask-box-repeat':false, // default: stretch
 'mask-box-slice':false, // default: 0 fill
 'mask-box-source':false, // default: none
 'mask-box-width':false, // default: auto
 'mask-clip':false, // default: border-box
 'mask-image':false, // default: none
 'mask-origin':false, // default: border-box
 'mask-position':false, // default: center
 'mask-repeat':false, // default: no-repeat
 'mask-size':false, // default: border-box
 'mask-source-type':false, // default: auto
 'mask-type':false, // default: luminance
 'max-height':true, // default: none
 'max-lines':false, // default: none
 'max-width':true, // default: none
 'min-height':true, // default: 0
 'min-width':true, // default: 0
 'move-to':false, // default: normal
 'nav-down':false, // default: auto
 'nav-index':false, // default: auto
 'nav-left':false, // default: auto
 'nav-right':false, // default: auto
 'nav-up':false, // default: auto
 'object-fit':false, // default: fill
 'object-position':false, // default: 50% 50%
 'opacity':false, // default: 1
 'order':false, // default: 0
 'orphans':false, // default: 2
 'outline':false, // default: depending on individual properties
 'outline-color':false, // default: invert
 'outline-offset':false, // default: 0
 'outline-style':false, // default: none
 'outline-width':false, // default: medium
 'overflow':false, // default: depending on individual properties
 'overflow-wrap':false, // default: normal
 'overflow-x':false, // default: visible
 'overflow-y':false, // default: visible
 'padding':true, // default: depending on individual properties
 'padding-bottom':true, // default: 0
 'padding-left':true, // default: 0
 'padding-right':true, // default: 0
 'padding-top':true, // default: 0
 'page':false, // default: auto
 'page-break-after':false, // default: auto
 'page-break-before':false, // default: auto
 'page-break-inside':false, // default: auto
 'page-policy':false, // default: start
 'pause':false, // default: implementation dependent
 'pause-after':false, // default: implementation dependent
 'pause-before':false, // default: implementation dependent
 'perspective':false, // default: none
 'perspective-origin':false, // default: 50% 50%
 'pitch':false, // default: medium
 'pitch-range':false, // default: 50
 'play-during':false, // default: auto
 'position':false, // default: static
 'presentation-level':false, // default: 0
 'quotes':false, // default: text
 'region-fragment':false, // default: auto
 'resize':false, // default: none
 'rest':false, // default: depending on individual properties
 'rest-after':false, // default: none
 'rest-before':false, // default: none
 'richness':false, // default: 50
 'right':false, // default: auto
 'rotation':false, // default: 0
 'rotation-point':false, // default: 50% 50%
 'ruby-align':false, // default: auto
 'ruby-merge':false, // default: separate
 'ruby-position':false, // default: before
 'shape-image-threshold':false, // default: 0.0
 'shape-outside':false, // default: none
 'shape-margin':false, // default: 0
 'size':false, // default: auto
 'speak':false, // default: auto
 'speak-as':false, // default: normal
 'speak-header':false, // default: once
 'speak-numeral':false, // default: continuous
 'speak-punctuation':false, // default: none
 'speech-rate':false, // default: medium
 'stress':false, // default: 50
 'string-set':false, // default: none
 'tab-size':false, // default: 8
 'table-layout':false, // default: auto
 'text-align':true, // default: start
 'text-align-last':true, // default: auto
 'text-combine-upright':true, // default: none
 'text-decoration':true, // default: none
 'text-decoration-color':true, // default: currentColor
 'text-decoration-line':true, // default: none
 'text-decoration-skip':true, // default: objects
 'text-decoration-style':true, // default: solid
 'text-emphasis':true, // default: depending on individual properties
 'text-emphasis-color':true, // default: currentColor
 'text-emphasis-position':true, // default: over right
 'text-emphasis-style':true, // default: none
 'text-height':true, // default: auto
 'text-indent':true, // default: 0
 'text-justify':true, // default: auto
 'text-orientation':true, // default: mixed
 'text-overflow':true, // default: clip
 'text-shadow':true, // default: none
 'text-space-collapse':true, // default: collapse
 'text-transform':true, // default: none
 'text-underline-position':true, // default: auto
 'text-wrap':true, // default: normal
 'top':false, // default: auto
 'transform':false, // default: none
 'transform-origin':false, // default: 50% 50% 0
 'transform-style':false, // default: flat
 'transition':false, // default: depending on individual properties
 'transition-delay':false, // default: 0s
 'transition-duration':false, // default: 0s
 'transition-property':false, // default: all
 'transition-timing-function':false, // default: ease
 'unicode-bidi':false, // default: normal
 'vertical-align':false, // default: baseline
 'visibility':false, // default: visible
 'voice-balance':false, // default: center
 'voice-duration':false, // default: auto
 'voice-family':false, // default: implementation dependent
 'voice-pitch':false, // default: medium
 'voice-range':false, // default: medium
 'voice-rate':false, // default: normal
 'voice-stress':false, // default: normal
 'voice-volume':false, // default: medium
 'volume':false, // default: medium
 'white-space':false, // default: normal
 'widows':false, // default: 2
 'width':true, // default: auto
 'will-change':false, // default: auto
 'word-break':true, // default: normal
 'word-spacing':true, // default: normal
 'word-wrap':true, // default: normal
 'wrap-flow':false, // default: auto
 'wrap-through':false, // default: wrap
 'writing-mode':false, // default: horizontal-tb
 'z-index':false, // default: auto
}};
