/**
 * Build styles
 */
import './index.css';

import { IconAlignLeft, IconAlignCenter } from '@codexteam/icons';

const IconQuote = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_2703_124953)"><path fill-rule="evenodd" clip-rule="evenodd" d="M22 6.499C19.385 7.887 18.077 9.519 18.077 11.393C19.1538 11.5117 20.1437 12.0398 20.842 12.868C21.5574 13.676 21.9473 14.7209 21.936 15.8C21.936 16.98 21.582 17.975 20.875 18.785C20.167 19.595 19.278 20 18.205 20C17.005 20 15.965 19.474 15.087 18.42C14.207 17.368 13.768 16.09 13.768 14.586C13.768 10.074 16.105 6.546 20.778 4L22 6.499ZM10.232 6.499C7.595 7.887 6.277 9.519 6.277 11.393C7.413 11.531 8.345 12.023 9.074 12.868C9.78907 13.6761 10.1786 14.721 10.167 15.8C10.167 16.98 9.808 17.975 9.09 18.785C8.372 19.595 7.477 20 6.405 20C5.205 20 4.17 19.474 3.302 18.42C2.434 17.369 2 16.09 2 14.587C2 10.074 4.326 6.546 8.977 4L10.232 6.499Z" fill="black"/></g><defs><clipPath id="clip0_2703_124953"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>'

/**
 * @class Quote
 * @classdesc Quote Tool for Editor.js
 * @property {QuoteData} data - Tool`s input and output data
 * @propert {object} api - Editor.js API instance
 *
 * @typedef {object} QuoteData
 * @description Quote Tool`s input and output data
 * @property {string} text - quote`s text
 * @property {'center'|'left'} alignment - quote`s alignment
 *
 * @typedef {object} QuoteConfig
 * @description Quote Tool`s initial configuration
 * @property {string} quotePlaceholder - placeholder to show in quote`s text input
 * @property {'center'|'left'} defaultAlignment - alignment to use as default
 *
 * @typedef {object} TunesMenuConfig
 * @property {string} icon - menu item icon
 * @property {string} label - menu item label
 * @property {boolean} isActive - true if item should be in active state
 * @property {boolean} closeOnActivate - if true tunes menu should close once any item is selected
 * @property {() => void} onActivate - item activation callback
 */
export default class Quote {
  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: IconQuote,
      title: 'Quote',
    };
  }

  /**
   * Empty Quote is not empty Block
   *
   * @public
   * @returns {boolean}
   */
  static get contentless() {
    return true;
  }

  /**
   * Allow to press Enter inside the Quote
   *
   * @public
   * @returns {boolean}
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * Default placeholder for quote text
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_QUOTE_PLACEHOLDER() {
    return 'Enter a quote';
  }

  /**
   * Allowed quote alignments
   *
   * @public
   * @returns {{left: string, center: string}}
   */
  static get ALIGNMENTS() {
    return {
      left: 'left',
      center: 'center',
    };
  }

  /**
   * Default quote alignment
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_ALIGNMENT() {
    return Quote.ALIGNMENTS.left;
  }

  /**
   * Allow Quote to be converted to/from other blocks
   */
  static get conversionConfig() {
    return {
      /**
       * To create Quote data from string, simple fill 'text' property
       */
      import: 'text',
      /**
       * To create string from Quote data, concatenate text and caption
       *
       * @param {QuoteData} quoteData
       * @returns {string}
       */
      export: function (quoteData) {
        return quoteData.text;
      },
    };
  }

  /**
   * Tool`s styles
   *
   * @returns {{baseClass: string, wrapper: string, quote: string, input: string, caption: string}}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      wrapper: 'cdx-quote',
      text: 'cdx-quote__text',
      input: this.api.styles.input,
    };
  }

  /**
   * Tool`s settings properties
   *
   * @returns {*[]}
   */
  get settings() {
    return [
      {
        name: 'left',
        icon: IconAlignLeft,
      },
      {
        name: 'center',
        icon: IconAlignCenter,
      },
    ];
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: QuoteData, config: QuoteConfig, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   *   readOnly - read-only mode flag
   */
  constructor({ data, config, api, readOnly }) {
    const { ALIGNMENTS, DEFAULT_ALIGNMENT } = Quote;

    this.api = api;
    this.readOnly = readOnly;

    this.quotePlaceholder = config.quotePlaceholder || Quote.DEFAULT_QUOTE_PLACEHOLDER;

    this.data = {
      text: data.text || '',
      alignment: Object.values(ALIGNMENTS).includes(data.alignment) && data.alignment ||
      config.defaultAlignment ||
      DEFAULT_ALIGNMENT,
    };
  }

  /**
   * Create Quote Tool container with inputs
   *
   * @returns {Element}
   */
  render() {
    const container = this._make('blockquote', [this.CSS.baseClass, this.CSS.wrapper]);
    const quote = this._make('div', [this.CSS.input, this.CSS.text], {
      contentEditable: !this.readOnly,
      innerHTML: this.data.text,
    });

    quote.dataset.placeholder = this.quotePlaceholder;

    container.appendChild(quote);

    return container;
  }

  /**
   * Extract Quote data from Quote Tool element
   *
   * @param {HTMLDivElement} quoteElement - element to save
   * @returns {QuoteData}
   */
  save(quoteElement) {
    const text = quoteElement.querySelector(`.${this.CSS.text}`);

    return Object.assign(this.data, {
      text: text.innerHTML,
    });
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      text: {
        div: true,
        br: true,
      },
      alignment: {},
    };
  }

  /**
   * Create wrapper for Tool`s settings buttons:
   * 1. Left alignment
   * 2. Center alignment
   *
   * @returns {TunesMenuConfig}
   *
   */
  renderSettings() {
    const capitalize = str => str[0].toUpperCase() + str.substr(1);

    return this.settings.map(item => ({
      icon: item.icon,
      label: this.api.i18n.t(`Align ${capitalize(item.name)}`),
      onActivate: () => this._toggleTune(item.name),
      isActive: this.data.alignment === item.name,
      closeOnActivate: true,
    }));
  };

  /**
   * Toggle quote`s alignment
   *
   * @param {string} tune - alignment
   * @private
   */
  _toggleTune(tune) {
    this.data.alignment = tune;
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {Array|string} classNames  - list or name of CSS classname(s)
   * @param  {object} attributes        - any attributes
   * @returns {Element}
   */
  _make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }
}
