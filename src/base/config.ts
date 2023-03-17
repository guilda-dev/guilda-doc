export type ItemSelectionConfig<T extends string = string> = {
  hierarchy: T[]
  fallback: T
}

export type IncompleteItemSelectionConfig<T extends string = string> = Partial<ItemSelectionConfig<T> | {
  hierarchy: T;
  fallback: T
}>;


export type DocumentSiteConfig = {
  lang: ItemSelectionConfig, 
  format: ItemSelectionConfig, 
  template: {
    allowed: boolean, 
    root: string,
    fileSuffix: string,
  },
  math: {
    allowed: boolean, 
    allowedFormats: string[], 
    interpreter: string
  },
  emoji: {
    allowed: boolean,
  },
  nav: {
    expandClass: string,
  }
}

export type IncompleteDocumentSiteConfig = Partial<DocumentSiteConfig | {
  lang: IncompleteItemSelectionConfig,
  format: IncompleteItemSelectionConfig, 
  math: Partial<{
    allowed: boolean, 
    allowedFormats: string | string[], 
    interpreter: string
  }>,
  template: Partial<{
    allowed: boolean, 
    root: string,
    fileSuffix: string,
  }>,
  emoji: Partial<{
    allowed: boolean,
  }>,
  nav: Partial<{
    expandClass: string,
  }>,
}>;

export const resolveItemSelectionConfig = (raw?: IncompleteItemSelectionConfig): ItemSelectionConfig => {
  raw = raw ?? {};
  raw.hierarchy = raw.hierarchy ?? '';
  const res: ItemSelectionConfig = {
    hierarchy: (typeof raw.hierarchy === 'string' ? [raw.hierarchy] : raw.hierarchy)
      .map(x => x.trim()).filter(x => x !== undefined && x !== null),
    fallback: (raw.fallback ?? '').trim(),
  };
  return res;
};


export const resolveDocumentSiteConfig = (raw?: IncompleteDocumentSiteConfig): DocumentSiteConfig => {
  raw = raw ?? {};
  raw.math = raw.math ?? {};
  raw.template = raw.template ?? {};
  raw.emoji = raw.emoji ?? {};
  raw.nav = raw.nav ?? {};
  const res: DocumentSiteConfig = {
    lang: resolveItemSelectionConfig(raw.lang),
    format: resolveItemSelectionConfig(raw.format),
    math: {
      allowed: raw.math.allowed ?? false,
      allowedFormats: raw.math.allowedFormats === undefined ? 
        ['math'] : 
        (typeof raw.math.allowedFormats === 'string' ?
          [raw.math.allowedFormats] :
          raw.math.allowedFormats),
      interpreter: raw.math.interpreter ?? 'mathjax',
    },
    template: {
      allowed: raw.template.allowed ?? false,
      root: raw.template.root ?? '', 
      fileSuffix: raw.template.fileSuffix ?? 't',
    },
    emoji: {
      allowed: raw.emoji.allowed ?? false,
    },
    nav: {
      expandClass: raw.nav.expandClass?.trim() || /* intentional */ 'expanded',
    }
  };
  return res;
};