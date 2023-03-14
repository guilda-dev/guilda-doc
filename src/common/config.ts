import * as yaml from 'js-yaml';

import nav from '~/nav.yml?raw';
import config from '~/config.yml?raw';

// navigation tree

import { compileNavRecordMap, NavRecordMap } from '@/base/nav';
import { IncompleteDocumentSiteConfig, resolveDocumentSiteConfig } from '@/base/config';
import { deepFreeze } from '../base/common';

const _navTreeRaw = yaml.load(nav) as NavRecordMap;
const NavTree = deepFreeze(compileNavRecordMap(_navTreeRaw));

const _configRaw = yaml.load(config) as IncompleteDocumentSiteConfig;
const SiteConfig = deepFreeze(resolveDocumentSiteConfig(_configRaw));

// check validity



export {
  NavTree, 
  SiteConfig
};
