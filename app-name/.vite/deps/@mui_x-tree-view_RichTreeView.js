import {
  Checkbox_default,
  Collapse_default
} from "./chunk-37RRTPMA.js";
import "./chunk-UYG5USFZ.js";
import {
  resolveComponentProps,
  useSlotProps
} from "./chunk-NG5TYB52.js";
import {
  useThemeProps
} from "./chunk-4C6XUUCV.js";
import "./chunk-STSKKGUF.js";
import "./chunk-GSXCP2JX.js";
import "./chunk-6C2FNHDJ.js";
import {
  alpha,
  useRtl
} from "./chunk-MH7K36WG.js";
import {
  init_utils
} from "./chunk-RVBJALU3.js";
import "./chunk-DKOYYANP.js";
import "./chunk-ZPLPHVER.js";
import "./chunk-T4VMIGJ6.js";
import {
  createSvgIcon
} from "./chunk-Z6HUVRV3.js";
import "./chunk-VIFEPOMO.js";
import "./chunk-D26TSY76.js";
import "./chunk-S3LKCIYK.js";
import {
  elementTypeAcceptingRef_default,
  init_elementTypeAcceptingRef,
  init_ownerDocument,
  init_unsupportedProp,
  init_useEventCallback,
  init_useForkRef,
  init_useId,
  ownerDocument,
  unsupportedProp,
  useEventCallback_default,
  useForkRef,
  useId
} from "./chunk-PHDUSAPY.js";
import {
  _extends,
  _objectWithoutPropertiesLoose,
  clsx_default,
  composeClasses,
  generateUtilityClass,
  generateUtilityClasses,
  init_clsx,
  init_composeClasses,
  init_extends,
  init_generateUtilityClass,
  init_generateUtilityClasses,
  init_objectWithoutPropertiesLoose,
  require_createStyled,
  require_jsx_runtime,
  require_prop_types,
  styled_default
} from "./chunk-SUOPKVHQ.js";
import "./chunk-KOABQC56.js";
import {
  require_react
} from "./chunk-XRMR5KPY.js";
import {
  __toESM
} from "./chunk-WGAPYIUP.js";

// node_modules/@mui/x-tree-view/RichTreeView/RichTreeView.js
init_extends();
var React18 = __toESM(require_react());
var import_prop_types4 = __toESM(require_prop_types());
init_composeClasses();

// node_modules/@mui/x-tree-view/RichTreeView/richTreeViewClasses.js
init_generateUtilityClass();
init_generateUtilityClasses();
function getRichTreeViewUtilityClass(slot) {
  return generateUtilityClass("MuiRichTreeView", slot);
}
var richTreeViewClasses = generateUtilityClasses("MuiRichTreeView", ["root"]);

// node_modules/@mui/x-tree-view/internals/zero-styled/index.js
function createUseThemeProps(name) {
  return useThemeProps;
}

// node_modules/@mui/x-tree-view/internals/useTreeView/useTreeView.js
init_extends();
var React4 = __toESM(require_react());
init_useForkRef();

// node_modules/@mui/x-tree-view/internals/useTreeView/useTreeViewModels.js
init_extends();
var React = __toESM(require_react());
var useTreeViewModels = (plugins, props) => {
  const modelsRef = React.useRef({});
  const [modelsState, setModelsState] = React.useState(() => {
    const initialState = {};
    plugins.forEach((plugin) => {
      if (plugin.models) {
        Object.entries(plugin.models).forEach(([modelName, modelInitializer]) => {
          modelsRef.current[modelName] = {
            isControlled: props[modelName] !== void 0,
            getDefaultValue: modelInitializer.getDefaultValue
          };
          initialState[modelName] = modelInitializer.getDefaultValue(props);
        });
      }
    });
    return initialState;
  });
  const models = Object.fromEntries(Object.entries(modelsRef.current).map(([modelName, model]) => {
    const value = props[modelName] ?? modelsState[modelName];
    return [modelName, {
      value,
      setControlledValue: (newValue) => {
        if (!model.isControlled) {
          setModelsState((prevState) => _extends({}, prevState, {
            [modelName]: newValue
          }));
        }
      }
    }];
  }));
  if (true) {
    Object.entries(modelsRef.current).forEach(([modelName, model]) => {
      const controlled = props[modelName];
      const newDefaultValue = model.getDefaultValue(props);
      React.useEffect(() => {
        if (model.isControlled !== (controlled !== void 0)) {
          console.error([`MUI X: A component is changing the ${model.isControlled ? "" : "un"}controlled ${modelName} state of TreeView to be ${model.isControlled ? "un" : ""}controlled.`, "Elements should not switch from uncontrolled to controlled (or vice versa).", `Decide between using a controlled or uncontrolled ${modelName} element for the lifetime of the component.`, "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.", "More info: https://fb.me/react-controlled-components"].join("\n"));
        }
      }, [controlled]);
      const {
        current: defaultValue
      } = React.useRef(newDefaultValue);
      React.useEffect(() => {
        if (!model.isControlled && defaultValue !== newDefaultValue) {
          console.error([`MUI X: A component is changing the default ${modelName} state of an uncontrolled TreeView after being initialized. To suppress this warning opt to use a controlled TreeView.`].join("\n"));
        }
      }, [JSON.stringify(newDefaultValue)]);
    });
  }
  return models;
};

// node_modules/@mui/x-tree-view/internals/corePlugins/useTreeViewInstanceEvents/useTreeViewInstanceEvents.js
var React2 = __toESM(require_react());

// node_modules/@mui/x-tree-view/internals/utils/EventManager.js
var EventManager = class {
  constructor() {
    this.maxListeners = 20;
    this.warnOnce = false;
    this.events = {};
  }
  on(eventName, listener, options = {}) {
    let collection = this.events[eventName];
    if (!collection) {
      collection = {
        highPriority: /* @__PURE__ */ new Map(),
        regular: /* @__PURE__ */ new Map()
      };
      this.events[eventName] = collection;
    }
    if (options.isFirst) {
      collection.highPriority.set(listener, true);
    } else {
      collection.regular.set(listener, true);
    }
    if (true) {
      const collectionSize = collection.highPriority.size + collection.regular.size;
      if (collectionSize > this.maxListeners && !this.warnOnce) {
        this.warnOnce = true;
        console.warn([`Possible EventEmitter memory leak detected. ${collectionSize} ${eventName} listeners added.`].join("\n"));
      }
    }
  }
  removeListener(eventName, listener) {
    if (this.events[eventName]) {
      this.events[eventName].regular.delete(listener);
      this.events[eventName].highPriority.delete(listener);
    }
  }
  removeAllListeners() {
    this.events = {};
  }
  emit(eventName, ...args) {
    const collection = this.events[eventName];
    if (!collection) {
      return;
    }
    const highPriorityListeners = Array.from(collection.highPriority.keys());
    const regularListeners = Array.from(collection.regular.keys());
    for (let i = highPriorityListeners.length - 1; i >= 0; i -= 1) {
      const listener = highPriorityListeners[i];
      if (collection.highPriority.has(listener)) {
        listener.apply(this, args);
      }
    }
    for (let i = 0; i < regularListeners.length; i += 1) {
      const listener = regularListeners[i];
      if (collection.regular.has(listener)) {
        listener.apply(this, args);
      }
    }
  }
  once(eventName, listener) {
    const that = this;
    this.on(eventName, function oneTimeListener(...args) {
      that.removeListener(eventName, oneTimeListener);
      listener.apply(that, args);
    });
  }
};

// node_modules/@mui/x-tree-view/internals/corePlugins/useTreeViewInstanceEvents/useTreeViewInstanceEvents.js
var isSyntheticEvent = (event) => {
  return event.isPropagationStopped !== void 0;
};
var useTreeViewInstanceEvents = () => {
  const [eventManager] = React2.useState(() => new EventManager());
  const publishEvent = React2.useCallback((...args) => {
    const [name, params, event = {}] = args;
    event.defaultMuiPrevented = false;
    if (isSyntheticEvent(event) && event.isPropagationStopped()) {
      return;
    }
    eventManager.emit(name, params, event);
  }, [eventManager]);
  const subscribeEvent = React2.useCallback((event, handler) => {
    eventManager.on(event, handler);
    return () => {
      eventManager.removeListener(event, handler);
    };
  }, [eventManager]);
  return {
    instance: {
      $$publishEvent: publishEvent,
      $$subscribeEvent: subscribeEvent
    }
  };
};
useTreeViewInstanceEvents.params = {};

// node_modules/@mui/x-tree-view/internals/corePlugins/useTreeViewOptionalPlugins/useTreeViewOptionalPlugins.js
var useTreeViewOptionalPlugins = ({
  plugins
}) => {
  const pluginSet = new Set(plugins);
  const getAvailablePlugins = () => pluginSet;
  return {
    instance: {
      getAvailablePlugins
    }
  };
};
useTreeViewOptionalPlugins.params = {};

// node_modules/@mui/x-tree-view/internals/corePlugins/useTreeViewId/useTreeViewId.js
var React3 = __toESM(require_react());
init_useId();
var useTreeViewId = ({
  params
}) => {
  const treeId = useId(params.id);
  const getTreeItemIdAttribute = React3.useCallback((itemId, idAttribute) => idAttribute ?? `${treeId}-${itemId}`, [treeId]);
  return {
    getRootProps: () => ({
      id: treeId
    }),
    instance: {
      getTreeItemIdAttribute
    }
  };
};
useTreeViewId.params = {
  id: true
};

// node_modules/@mui/x-tree-view/internals/corePlugins/corePlugins.js
var TREE_VIEW_CORE_PLUGINS = [useTreeViewInstanceEvents, useTreeViewOptionalPlugins, useTreeViewId];

// node_modules/@mui/x-tree-view/internals/useTreeView/extractPluginParamsFromProps.js
init_objectWithoutPropertiesLoose();
var _excluded = ["slots", "slotProps", "apiRef", "experimentalFeatures"];
var extractPluginParamsFromProps = (_ref) => {
  let {
    props: {
      slots,
      slotProps,
      apiRef,
      experimentalFeatures
    },
    plugins
  } = _ref, props = _objectWithoutPropertiesLoose(_ref.props, _excluded);
  const paramsLookup = {};
  plugins.forEach((plugin) => {
    Object.assign(paramsLookup, plugin.params);
  });
  const pluginParams = {};
  const forwardedProps = {};
  Object.keys(props).forEach((propName) => {
    const prop = props[propName];
    if (paramsLookup[propName]) {
      pluginParams[propName] = prop;
    } else {
      forwardedProps[propName] = prop;
    }
  });
  const defaultizedPluginParams = plugins.reduce((acc, plugin) => {
    if (plugin.getDefaultizedParams) {
      return plugin.getDefaultizedParams(acc);
    }
    return acc;
  }, pluginParams);
  return {
    apiRef,
    forwardedProps,
    pluginParams: defaultizedPluginParams,
    slots: slots ?? {},
    slotProps: slotProps ?? {},
    experimentalFeatures: experimentalFeatures ?? {}
  };
};

// node_modules/@mui/x-tree-view/internals/useTreeView/useTreeView.js
function useTreeViewApiInitialization(inputApiRef) {
  const fallbackPublicApiRef = React4.useRef({});
  if (inputApiRef) {
    if (inputApiRef.current == null) {
      inputApiRef.current = {};
    }
    return inputApiRef.current;
  }
  return fallbackPublicApiRef.current;
}
var useTreeView = ({
  plugins: inPlugins,
  rootRef,
  props
}) => {
  const plugins = [...TREE_VIEW_CORE_PLUGINS, ...inPlugins];
  const {
    pluginParams,
    forwardedProps,
    apiRef,
    experimentalFeatures,
    slots,
    slotProps
  } = extractPluginParamsFromProps({
    plugins,
    props
  });
  const models = useTreeViewModels(plugins, pluginParams);
  const instanceRef = React4.useRef({});
  const instance = instanceRef.current;
  const publicAPI = useTreeViewApiInitialization(apiRef);
  const innerRootRef = React4.useRef(null);
  const handleRootRef = useForkRef(innerRootRef, rootRef);
  const [state, setState] = React4.useState(() => {
    const temp = {};
    plugins.forEach((plugin) => {
      if (plugin.getInitialState) {
        Object.assign(temp, plugin.getInitialState(pluginParams));
      }
    });
    return temp;
  });
  const itemWrappers = plugins.map((plugin) => plugin.wrapItem).filter((wrapItem2) => !!wrapItem2);
  const wrapItem = ({
    itemId,
    children
  }) => {
    let finalChildren = children;
    itemWrappers.forEach((itemWrapper) => {
      finalChildren = itemWrapper({
        itemId,
        children: finalChildren,
        instance
      });
    });
    return finalChildren;
  };
  const rootWrappers = plugins.map((plugin) => plugin.wrapRoot).filter((wrapRoot2) => !!wrapRoot2).reverse();
  const wrapRoot = ({
    children
  }) => {
    let finalChildren = children;
    rootWrappers.forEach((rootWrapper) => {
      finalChildren = rootWrapper({
        children: finalChildren,
        instance
      });
    });
    return finalChildren;
  };
  const runItemPlugins = (itemPluginProps) => {
    let finalRootRef = null;
    let finalContentRef = null;
    plugins.forEach((plugin) => {
      if (!plugin.itemPlugin) {
        return;
      }
      const itemPluginResponse = plugin.itemPlugin({
        props: itemPluginProps,
        rootRef: finalRootRef,
        contentRef: finalContentRef
      });
      if (itemPluginResponse == null ? void 0 : itemPluginResponse.rootRef) {
        finalRootRef = itemPluginResponse.rootRef;
      }
      if (itemPluginResponse == null ? void 0 : itemPluginResponse.contentRef) {
        finalContentRef = itemPluginResponse.contentRef;
      }
    });
    return {
      contentRef: finalContentRef,
      rootRef: finalRootRef
    };
  };
  const contextValue = {
    publicAPI,
    wrapItem,
    wrapRoot,
    runItemPlugins,
    instance,
    rootRef: innerRootRef
  };
  const rootPropsGetters = [];
  const runPlugin = (plugin) => {
    const pluginResponse = plugin({
      instance,
      params: pluginParams,
      slots,
      slotProps,
      experimentalFeatures,
      state,
      setState,
      rootRef: innerRootRef,
      models,
      plugins
    });
    if (pluginResponse.getRootProps) {
      rootPropsGetters.push(pluginResponse.getRootProps);
    }
    if (pluginResponse.publicAPI) {
      Object.assign(publicAPI, pluginResponse.publicAPI);
    }
    if (pluginResponse.instance) {
      Object.assign(instance, pluginResponse.instance);
    }
    if (pluginResponse.contextValue) {
      Object.assign(contextValue, pluginResponse.contextValue);
    }
  };
  plugins.forEach(runPlugin);
  const getRootProps = (otherHandlers = {}) => {
    const rootProps = _extends({
      role: "tree"
    }, forwardedProps, otherHandlers, {
      ref: handleRootRef
    });
    rootPropsGetters.forEach((rootPropsGetter) => {
      Object.assign(rootProps, rootPropsGetter(otherHandlers));
    });
    return rootProps;
  };
  return {
    getRootProps,
    rootRef: handleRootRef,
    contextValue,
    instance
  };
};

// node_modules/@mui/x-tree-view/internals/TreeViewProvider/TreeViewProvider.js
var React6 = __toESM(require_react());

// node_modules/@mui/x-tree-view/internals/TreeViewProvider/TreeViewContext.js
var React5 = __toESM(require_react());
var TreeViewContext = React5.createContext(null);
if (true) {
  TreeViewContext.displayName = "TreeViewContext";
}

// node_modules/@mui/x-tree-view/internals/TreeViewProvider/TreeViewProvider.js
var import_jsx_runtime = __toESM(require_jsx_runtime());
function TreeViewProvider(props) {
  const {
    value,
    children
  } = props;
  return (0, import_jsx_runtime.jsx)(TreeViewContext.Provider, {
    value,
    children: value.wrapRoot({
      children
    })
  });
}

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewItems/useTreeViewItems.js
init_extends();
init_objectWithoutPropertiesLoose();
var React8 = __toESM(require_react());

// node_modules/@mui/x-tree-view/internals/utils/publishTreeViewEvent.js
var publishTreeViewEvent = (instance, eventName, params) => {
  instance.$$publishEvent(eventName, params);
};

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewItems/useTreeViewItems.utils.js
var TREE_VIEW_ROOT_PARENT_ID = "__TREE_VIEW_ROOT_PARENT_ID__";
var buildSiblingIndexes = (siblings) => {
  const siblingsIndexLookup = {};
  siblings.forEach((childId, index) => {
    siblingsIndexLookup[childId] = index;
  });
  return siblingsIndexLookup;
};

// node_modules/@mui/x-tree-view/internals/TreeViewItemDepthContext/TreeViewItemDepthContext.js
var React7 = __toESM(require_react());
var TreeViewItemDepthContext = React7.createContext(() => -1);
if (true) {
  TreeViewItemDepthContext.displayName = "TreeViewItemDepthContext";
}

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewItems/useTreeViewItems.js
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
var _excluded2 = ["children"];
var updateItemsState = ({
  items,
  isItemDisabled,
  getItemLabel,
  getItemId
}) => {
  const itemMetaMap = {};
  const itemMap = {};
  const itemOrderedChildrenIds = {
    [TREE_VIEW_ROOT_PARENT_ID]: []
  };
  const processItem = (item, depth, parentId) => {
    var _a, _b;
    const id = getItemId ? getItemId(item) : item.id;
    if (id == null) {
      throw new Error(["MUI X: The Tree View component requires all items to have a unique `id` property.", "Alternatively, you can use the `getItemId` prop to specify a custom id for each item.", "An item was provided without id in the `items` prop:", JSON.stringify(item)].join("\n"));
    }
    if (itemMetaMap[id] != null) {
      throw new Error(["MUI X: The Tree View component requires all items to have a unique `id` property.", "Alternatively, you can use the `getItemId` prop to specify a custom id for each item.", `Two items were provided with the same id in the \`items\` prop: "${id}"`].join("\n"));
    }
    const label = getItemLabel ? getItemLabel(item) : item.label;
    if (label == null) {
      throw new Error(["MUI X: The Tree View component requires all items to have a `label` property.", "Alternatively, you can use the `getItemLabel` prop to specify a custom label for each item.", "An item was provided without label in the `items` prop:", JSON.stringify(item)].join("\n"));
    }
    itemMetaMap[id] = {
      id,
      label,
      parentId,
      idAttribute: void 0,
      expandable: !!((_a = item.children) == null ? void 0 : _a.length),
      disabled: isItemDisabled ? isItemDisabled(item) : false,
      depth
    };
    itemMap[id] = item;
    const parentIdWithDefault = parentId ?? TREE_VIEW_ROOT_PARENT_ID;
    if (!itemOrderedChildrenIds[parentIdWithDefault]) {
      itemOrderedChildrenIds[parentIdWithDefault] = [];
    }
    itemOrderedChildrenIds[parentIdWithDefault].push(id);
    (_b = item.children) == null ? void 0 : _b.forEach((child) => processItem(child, depth + 1, id));
  };
  items.forEach((item) => processItem(item, 0, null));
  const itemChildrenIndexes = {};
  Object.keys(itemOrderedChildrenIds).forEach((parentId) => {
    itemChildrenIndexes[parentId] = buildSiblingIndexes(itemOrderedChildrenIds[parentId]);
  });
  return {
    itemMetaMap,
    itemMap,
    itemOrderedChildrenIds,
    itemChildrenIndexes
  };
};
var useTreeViewItems = ({
  instance,
  params,
  state,
  setState,
  experimentalFeatures
}) => {
  const getItemMeta = React8.useCallback((itemId) => state.items.itemMetaMap[itemId], [state.items.itemMetaMap]);
  const getItem = React8.useCallback((itemId) => state.items.itemMap[itemId], [state.items.itemMap]);
  const getItemTree = React8.useCallback(() => {
    const getItemFromItemId = (id) => {
      const _state$items$itemMap$ = state.items.itemMap[id], item = _objectWithoutPropertiesLoose(_state$items$itemMap$, _excluded2);
      const newChildren = state.items.itemOrderedChildrenIds[id];
      if (newChildren) {
        item.children = newChildren.map(getItemFromItemId);
      }
      return item;
    };
    return state.items.itemOrderedChildrenIds[TREE_VIEW_ROOT_PARENT_ID].map(getItemFromItemId);
  }, [state.items.itemMap, state.items.itemOrderedChildrenIds]);
  const isItemDisabled = React8.useCallback((itemId) => {
    if (itemId == null) {
      return false;
    }
    let itemMeta = instance.getItemMeta(itemId);
    if (!itemMeta) {
      return false;
    }
    if (itemMeta.disabled) {
      return true;
    }
    while (itemMeta.parentId != null) {
      itemMeta = instance.getItemMeta(itemMeta.parentId);
      if (itemMeta.disabled) {
        return true;
      }
    }
    return false;
  }, [instance]);
  const getItemIndex = React8.useCallback((itemId) => {
    const parentId = instance.getItemMeta(itemId).parentId ?? TREE_VIEW_ROOT_PARENT_ID;
    return state.items.itemChildrenIndexes[parentId][itemId];
  }, [instance, state.items.itemChildrenIndexes]);
  const getItemOrderedChildrenIds = React8.useCallback((itemId) => state.items.itemOrderedChildrenIds[itemId ?? TREE_VIEW_ROOT_PARENT_ID] ?? [], [state.items.itemOrderedChildrenIds]);
  const getItemDOMElement = (itemId) => {
    const itemMeta = instance.getItemMeta(itemId);
    if (itemMeta == null) {
      return null;
    }
    return document.getElementById(instance.getTreeItemIdAttribute(itemId, itemMeta.idAttribute));
  };
  const isItemNavigable = (itemId) => {
    if (params.disabledItemsFocusable) {
      return true;
    }
    return !instance.isItemDisabled(itemId);
  };
  const areItemUpdatesPreventedRef = React8.useRef(false);
  const preventItemUpdates = React8.useCallback(() => {
    areItemUpdatesPreventedRef.current = true;
  }, []);
  const areItemUpdatesPrevented = React8.useCallback(() => areItemUpdatesPreventedRef.current, []);
  React8.useEffect(() => {
    if (instance.areItemUpdatesPrevented()) {
      return;
    }
    setState((prevState) => {
      const newState = updateItemsState({
        items: params.items,
        isItemDisabled: params.isItemDisabled,
        getItemId: params.getItemId,
        getItemLabel: params.getItemLabel
      });
      Object.values(prevState.items.itemMetaMap).forEach((item) => {
        if (!newState.itemMetaMap[item.id]) {
          publishTreeViewEvent(instance, "removeItem", {
            id: item.id
          });
        }
      });
      return _extends({}, prevState, {
        items: newState
      });
    });
  }, [instance, setState, params.items, params.isItemDisabled, params.getItemId, params.getItemLabel]);
  const getItemsToRender = () => {
    const getPropsFromItemId = (id) => {
      var _a;
      const item = state.items.itemMetaMap[id];
      return {
        label: item.label,
        itemId: item.id,
        id: item.idAttribute,
        children: (_a = state.items.itemOrderedChildrenIds[id]) == null ? void 0 : _a.map(getPropsFromItemId)
      };
    };
    return state.items.itemOrderedChildrenIds[TREE_VIEW_ROOT_PARENT_ID].map(getPropsFromItemId);
  };
  return {
    getRootProps: () => ({
      style: {
        "--TreeView-itemChildrenIndentation": typeof params.itemChildrenIndentation === "number" ? `${params.itemChildrenIndentation}px` : params.itemChildrenIndentation
      }
    }),
    publicAPI: {
      getItem,
      getItemDOMElement,
      getItemTree,
      getItemOrderedChildrenIds
    },
    instance: {
      getItemMeta,
      getItem,
      getItemTree,
      getItemsToRender,
      getItemIndex,
      getItemDOMElement,
      getItemOrderedChildrenIds,
      isItemDisabled,
      isItemNavigable,
      preventItemUpdates,
      areItemUpdatesPrevented
    },
    contextValue: {
      disabledItemsFocusable: params.disabledItemsFocusable,
      indentationAtItemLevel: experimentalFeatures.indentationAtItemLevel ?? false
    }
  };
};
useTreeViewItems.getInitialState = (params) => ({
  items: updateItemsState({
    items: params.items,
    isItemDisabled: params.isItemDisabled,
    getItemId: params.getItemId,
    getItemLabel: params.getItemLabel
  })
});
useTreeViewItems.getDefaultizedParams = (params) => _extends({}, params, {
  disabledItemsFocusable: params.disabledItemsFocusable ?? false,
  itemChildrenIndentation: params.itemChildrenIndentation ?? "12px"
});
useTreeViewItems.wrapRoot = ({
  children,
  instance
}) => {
  return (0, import_jsx_runtime2.jsx)(TreeViewItemDepthContext.Provider, {
    value: (itemId) => {
      var _a;
      return ((_a = instance.getItemMeta(itemId)) == null ? void 0 : _a.depth) ?? 0;
    },
    children
  });
};
useTreeViewItems.params = {
  disabledItemsFocusable: true,
  items: true,
  isItemDisabled: true,
  getItemLabel: true,
  getItemId: true,
  itemChildrenIndentation: true
};

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewExpansion/useTreeViewExpansion.js
init_extends();
var React9 = __toESM(require_react());
init_useEventCallback();
var useTreeViewExpansion = ({
  instance,
  params,
  models
}) => {
  const expandedItemsMap = React9.useMemo(() => {
    const temp = /* @__PURE__ */ new Map();
    models.expandedItems.value.forEach((id) => {
      temp.set(id, true);
    });
    return temp;
  }, [models.expandedItems.value]);
  const setExpandedItems = (event, value) => {
    var _a;
    (_a = params.onExpandedItemsChange) == null ? void 0 : _a.call(params, event, value);
    models.expandedItems.setControlledValue(value);
  };
  const isItemExpanded = React9.useCallback((itemId) => expandedItemsMap.has(itemId), [expandedItemsMap]);
  const isItemExpandable = React9.useCallback((itemId) => {
    var _a;
    return !!((_a = instance.getItemMeta(itemId)) == null ? void 0 : _a.expandable);
  }, [instance]);
  const toggleItemExpansion = useEventCallback_default((event, itemId) => {
    const isExpandedBefore = instance.isItemExpanded(itemId);
    instance.setItemExpansion(event, itemId, !isExpandedBefore);
  });
  const setItemExpansion = useEventCallback_default((event, itemId, isExpanded) => {
    const isExpandedBefore = instance.isItemExpanded(itemId);
    if (isExpandedBefore === isExpanded) {
      return;
    }
    let newExpanded;
    if (isExpanded) {
      newExpanded = [itemId].concat(models.expandedItems.value);
    } else {
      newExpanded = models.expandedItems.value.filter((id) => id !== itemId);
    }
    if (params.onItemExpansionToggle) {
      params.onItemExpansionToggle(event, itemId, isExpanded);
    }
    setExpandedItems(event, newExpanded);
  });
  const expandAllSiblings = (event, itemId) => {
    const itemMeta = instance.getItemMeta(itemId);
    const siblings = instance.getItemOrderedChildrenIds(itemMeta.parentId);
    const diff = siblings.filter((child) => instance.isItemExpandable(child) && !instance.isItemExpanded(child));
    const newExpanded = models.expandedItems.value.concat(diff);
    if (diff.length > 0) {
      if (params.onItemExpansionToggle) {
        diff.forEach((newlyExpandedItemId) => {
          params.onItemExpansionToggle(event, newlyExpandedItemId, true);
        });
      }
      setExpandedItems(event, newExpanded);
    }
  };
  const expansionTrigger = React9.useMemo(() => {
    if (params.expansionTrigger) {
      return params.expansionTrigger;
    }
    return "content";
  }, [params.expansionTrigger]);
  return {
    publicAPI: {
      setItemExpansion
    },
    instance: {
      isItemExpanded,
      isItemExpandable,
      setItemExpansion,
      toggleItemExpansion,
      expandAllSiblings
    },
    contextValue: {
      expansion: {
        expansionTrigger
      }
    }
  };
};
useTreeViewExpansion.models = {
  expandedItems: {
    getDefaultValue: (params) => params.defaultExpandedItems
  }
};
var DEFAULT_EXPANDED_ITEMS = [];
useTreeViewExpansion.getDefaultizedParams = (params) => _extends({}, params, {
  defaultExpandedItems: params.defaultExpandedItems ?? DEFAULT_EXPANDED_ITEMS
});
useTreeViewExpansion.params = {
  expandedItems: true,
  defaultExpandedItems: true,
  onExpandedItemsChange: true,
  onItemExpansionToggle: true,
  expansionTrigger: true
};

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewSelection/useTreeViewSelection.js
init_extends();
var React10 = __toESM(require_react());

// node_modules/@mui/x-tree-view/internals/utils/tree.js
var getLastNavigableItemInArray = (instance, items) => {
  let itemIndex = items.length - 1;
  while (itemIndex >= 0 && !instance.isItemNavigable(items[itemIndex])) {
    itemIndex -= 1;
  }
  if (itemIndex === -1) {
    return void 0;
  }
  return items[itemIndex];
};
var getPreviousNavigableItem = (instance, itemId) => {
  const itemMeta = instance.getItemMeta(itemId);
  const siblings = instance.getItemOrderedChildrenIds(itemMeta.parentId);
  const itemIndex = instance.getItemIndex(itemId);
  if (itemIndex === 0) {
    return itemMeta.parentId;
  }
  let previousNavigableSiblingIndex = itemIndex - 1;
  while (!instance.isItemNavigable(siblings[previousNavigableSiblingIndex]) && previousNavigableSiblingIndex >= 0) {
    previousNavigableSiblingIndex -= 1;
  }
  if (previousNavigableSiblingIndex === -1) {
    if (itemMeta.parentId == null) {
      return null;
    }
    return getPreviousNavigableItem(instance, itemMeta.parentId);
  }
  let currentItemId = siblings[previousNavigableSiblingIndex];
  let lastNavigableChild = getLastNavigableItemInArray(instance, instance.getItemOrderedChildrenIds(currentItemId));
  while (instance.isItemExpanded(currentItemId) && lastNavigableChild != null) {
    currentItemId = lastNavigableChild;
    lastNavigableChild = instance.getItemOrderedChildrenIds(currentItemId).find(instance.isItemNavigable);
  }
  return currentItemId;
};
var getNextNavigableItem = (instance, itemId) => {
  if (instance.isItemExpanded(itemId)) {
    const firstNavigableChild = instance.getItemOrderedChildrenIds(itemId).find(instance.isItemNavigable);
    if (firstNavigableChild != null) {
      return firstNavigableChild;
    }
  }
  let itemMeta = instance.getItemMeta(itemId);
  while (itemMeta != null) {
    const siblings = instance.getItemOrderedChildrenIds(itemMeta.parentId);
    const currentItemIndex = instance.getItemIndex(itemMeta.id);
    if (currentItemIndex < siblings.length - 1) {
      let nextItemIndex = currentItemIndex + 1;
      while (!instance.isItemNavigable(siblings[nextItemIndex]) && nextItemIndex < siblings.length - 1) {
        nextItemIndex += 1;
      }
      if (instance.isItemNavigable(siblings[nextItemIndex])) {
        return siblings[nextItemIndex];
      }
    }
    itemMeta = instance.getItemMeta(itemMeta.parentId);
  }
  return null;
};
var getLastNavigableItem = (instance) => {
  let itemId = null;
  while (itemId == null || instance.isItemExpanded(itemId)) {
    const children = instance.getItemOrderedChildrenIds(itemId);
    const lastNavigableChild = getLastNavigableItemInArray(instance, children);
    if (lastNavigableChild == null) {
      return itemId;
    }
    itemId = lastNavigableChild;
  }
  return itemId;
};
var getFirstNavigableItem = (instance) => instance.getItemOrderedChildrenIds(null).find(instance.isItemNavigable);
var findOrderInTremauxTree = (instance, itemAId, itemBId) => {
  if (itemAId === itemBId) {
    return [itemAId, itemBId];
  }
  const itemMetaA = instance.getItemMeta(itemAId);
  const itemMetaB = instance.getItemMeta(itemBId);
  if (itemMetaA.parentId === itemMetaB.id || itemMetaB.parentId === itemMetaA.id) {
    return itemMetaB.parentId === itemMetaA.id ? [itemMetaA.id, itemMetaB.id] : [itemMetaB.id, itemMetaA.id];
  }
  const aFamily = [itemMetaA.id];
  const bFamily = [itemMetaB.id];
  let aAncestor = itemMetaA.parentId;
  let bAncestor = itemMetaB.parentId;
  let aAncestorIsCommon = bFamily.indexOf(aAncestor) !== -1;
  let bAncestorIsCommon = aFamily.indexOf(bAncestor) !== -1;
  let continueA = true;
  let continueB = true;
  while (!bAncestorIsCommon && !aAncestorIsCommon) {
    if (continueA) {
      aFamily.push(aAncestor);
      aAncestorIsCommon = bFamily.indexOf(aAncestor) !== -1;
      continueA = aAncestor !== null;
      if (!aAncestorIsCommon && continueA) {
        aAncestor = instance.getItemMeta(aAncestor).parentId;
      }
    }
    if (continueB && !aAncestorIsCommon) {
      bFamily.push(bAncestor);
      bAncestorIsCommon = aFamily.indexOf(bAncestor) !== -1;
      continueB = bAncestor !== null;
      if (!bAncestorIsCommon && continueB) {
        bAncestor = instance.getItemMeta(bAncestor).parentId;
      }
    }
  }
  const commonAncestor = aAncestorIsCommon ? aAncestor : bAncestor;
  const ancestorFamily = instance.getItemOrderedChildrenIds(commonAncestor);
  const aSide = aFamily[aFamily.indexOf(commonAncestor) - 1];
  const bSide = bFamily[bFamily.indexOf(commonAncestor) - 1];
  return ancestorFamily.indexOf(aSide) < ancestorFamily.indexOf(bSide) ? [itemAId, itemBId] : [itemBId, itemAId];
};
var getNonDisabledItemsInRange = (instance, itemAId, itemBId) => {
  const getNextItem = (itemId) => {
    if (instance.isItemExpandable(itemId) && instance.isItemExpanded(itemId)) {
      return instance.getItemOrderedChildrenIds(itemId)[0];
    }
    let itemMeta = instance.getItemMeta(itemId);
    while (itemMeta != null) {
      const siblings = instance.getItemOrderedChildrenIds(itemMeta.parentId);
      const currentItemIndex = instance.getItemIndex(itemMeta.id);
      if (currentItemIndex < siblings.length - 1) {
        return siblings[currentItemIndex + 1];
      }
      itemMeta = instance.getItemMeta(itemMeta.parentId);
    }
    throw new Error("Invalid range");
  };
  const [first, last] = findOrderInTremauxTree(instance, itemAId, itemBId);
  const items = [first];
  let current = first;
  while (current !== last) {
    current = getNextItem(current);
    if (!instance.isItemDisabled(current)) {
      items.push(current);
    }
  }
  return items;
};
var getAllNavigableItems = (instance) => {
  let item = getFirstNavigableItem(instance);
  const navigableItems = [];
  while (item != null) {
    navigableItems.push(item);
    item = getNextNavigableItem(instance, item);
  }
  return navigableItems;
};

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewSelection/useTreeViewSelection.utils.js
var convertSelectedItemsToArray = (model) => {
  if (Array.isArray(model)) {
    return model;
  }
  if (model != null) {
    return [model];
  }
  return [];
};
var getLookupFromArray = (array) => {
  const lookup = {};
  array.forEach((itemId) => {
    lookup[itemId] = true;
  });
  return lookup;
};

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewSelection/useTreeViewSelection.js
var useTreeViewSelection = ({
  instance,
  params,
  models
}) => {
  const lastSelectedItem = React10.useRef(null);
  const lastSelectedRange = React10.useRef({});
  const selectedItemsMap = React10.useMemo(() => {
    const temp = /* @__PURE__ */ new Map();
    if (Array.isArray(models.selectedItems.value)) {
      models.selectedItems.value.forEach((id) => {
        temp.set(id, true);
      });
    } else if (models.selectedItems.value != null) {
      temp.set(models.selectedItems.value, true);
    }
    return temp;
  }, [models.selectedItems.value]);
  const setSelectedItems = (event, newSelectedItems) => {
    if (params.onItemSelectionToggle) {
      if (params.multiSelect) {
        const addedItems = newSelectedItems.filter((itemId) => !instance.isItemSelected(itemId));
        const removedItems = models.selectedItems.value.filter((itemId) => !newSelectedItems.includes(itemId));
        addedItems.forEach((itemId) => {
          params.onItemSelectionToggle(event, itemId, true);
        });
        removedItems.forEach((itemId) => {
          params.onItemSelectionToggle(event, itemId, false);
        });
      } else if (newSelectedItems !== models.selectedItems.value) {
        if (models.selectedItems.value != null) {
          params.onItemSelectionToggle(event, models.selectedItems.value, false);
        }
        if (newSelectedItems != null) {
          params.onItemSelectionToggle(event, newSelectedItems, true);
        }
      }
    }
    if (params.onSelectedItemsChange) {
      params.onSelectedItemsChange(event, newSelectedItems);
    }
    models.selectedItems.setControlledValue(newSelectedItems);
  };
  const isItemSelected = (itemId) => selectedItemsMap.has(itemId);
  const selectItem = ({
    event,
    itemId,
    keepExistingSelection = false,
    shouldBeSelected
  }) => {
    if (params.disableSelection) {
      return;
    }
    let newSelected;
    if (keepExistingSelection) {
      const cleanSelectedItems = convertSelectedItemsToArray(models.selectedItems.value);
      const isSelectedBefore = instance.isItemSelected(itemId);
      if (isSelectedBefore && (shouldBeSelected === false || shouldBeSelected == null)) {
        newSelected = cleanSelectedItems.filter((id) => id !== itemId);
      } else if (!isSelectedBefore && (shouldBeSelected === true || shouldBeSelected == null)) {
        newSelected = [itemId].concat(cleanSelectedItems);
      } else {
        newSelected = cleanSelectedItems;
      }
    } else {
      if (shouldBeSelected === false || shouldBeSelected == null && instance.isItemSelected(itemId)) {
        newSelected = params.multiSelect ? [] : null;
      } else {
        newSelected = params.multiSelect ? [itemId] : itemId;
      }
    }
    setSelectedItems(event, newSelected);
    lastSelectedItem.current = itemId;
    lastSelectedRange.current = {};
  };
  const selectRange = (event, [start, end]) => {
    if (params.disableSelection || !params.multiSelect) {
      return;
    }
    let newSelectedItems = convertSelectedItemsToArray(models.selectedItems.value).slice();
    if (Object.keys(lastSelectedRange.current).length > 0) {
      newSelectedItems = newSelectedItems.filter((id) => !lastSelectedRange.current[id]);
    }
    const selectedItemsLookup = getLookupFromArray(newSelectedItems);
    const range = getNonDisabledItemsInRange(instance, start, end);
    const itemsToAddToModel = range.filter((id) => !selectedItemsLookup[id]);
    newSelectedItems = newSelectedItems.concat(itemsToAddToModel);
    setSelectedItems(event, newSelectedItems);
    lastSelectedRange.current = getLookupFromArray(range);
  };
  const expandSelectionRange = (event, itemId) => {
    if (lastSelectedItem.current != null) {
      const [start, end] = findOrderInTremauxTree(instance, itemId, lastSelectedItem.current);
      selectRange(event, [start, end]);
    }
  };
  const selectRangeFromStartToItem = (event, itemId) => {
    selectRange(event, [getFirstNavigableItem(instance), itemId]);
  };
  const selectRangeFromItemToEnd = (event, itemId) => {
    selectRange(event, [itemId, getLastNavigableItem(instance)]);
  };
  const selectAllNavigableItems = (event) => {
    if (params.disableSelection || !params.multiSelect) {
      return;
    }
    const navigableItems = getAllNavigableItems(instance);
    setSelectedItems(event, navigableItems);
    lastSelectedRange.current = getLookupFromArray(navigableItems);
  };
  const selectItemFromArrowNavigation = (event, currentItem, nextItem) => {
    if (params.disableSelection || !params.multiSelect) {
      return;
    }
    let newSelectedItems = convertSelectedItemsToArray(models.selectedItems.value).slice();
    if (Object.keys(lastSelectedRange.current).length === 0) {
      newSelectedItems.push(nextItem);
      lastSelectedRange.current = {
        [currentItem]: true,
        [nextItem]: true
      };
    } else {
      if (!lastSelectedRange.current[currentItem]) {
        lastSelectedRange.current = {};
      }
      if (lastSelectedRange.current[nextItem]) {
        newSelectedItems = newSelectedItems.filter((id) => id !== currentItem);
        delete lastSelectedRange.current[currentItem];
      } else {
        newSelectedItems.push(nextItem);
        lastSelectedRange.current[nextItem] = true;
      }
    }
    setSelectedItems(event, newSelectedItems);
  };
  return {
    getRootProps: () => ({
      "aria-multiselectable": params.multiSelect
    }),
    publicAPI: {
      selectItem
    },
    instance: {
      isItemSelected,
      selectItem,
      selectAllNavigableItems,
      expandSelectionRange,
      selectRangeFromStartToItem,
      selectRangeFromItemToEnd,
      selectItemFromArrowNavigation
    },
    contextValue: {
      selection: {
        multiSelect: params.multiSelect,
        checkboxSelection: params.checkboxSelection,
        disableSelection: params.disableSelection
      }
    }
  };
};
useTreeViewSelection.models = {
  selectedItems: {
    getDefaultValue: (params) => params.defaultSelectedItems
  }
};
var DEFAULT_SELECTED_ITEMS = [];
useTreeViewSelection.getDefaultizedParams = (params) => _extends({}, params, {
  disableSelection: params.disableSelection ?? false,
  multiSelect: params.multiSelect ?? false,
  checkboxSelection: params.checkboxSelection ?? false,
  defaultSelectedItems: params.defaultSelectedItems ?? (params.multiSelect ? DEFAULT_SELECTED_ITEMS : null)
});
useTreeViewSelection.params = {
  disableSelection: true,
  multiSelect: true,
  checkboxSelection: true,
  defaultSelectedItems: true,
  selectedItems: true,
  onSelectedItemsChange: true,
  onItemSelectionToggle: true
};

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewFocus/useTreeViewFocus.js
init_extends();
var React12 = __toESM(require_react());
init_useEventCallback();
init_ownerDocument();

// node_modules/@mui/x-tree-view/internals/hooks/useInstanceEventHandler.js
var React11 = __toESM(require_react());

// node_modules/@mui/x-tree-view/internals/utils/cleanupTracking/TimerBasedCleanupTracking.js
var CLEANUP_TIMER_LOOP_MILLIS = 1e3;
var TimerBasedCleanupTracking = class {
  constructor(timeout = CLEANUP_TIMER_LOOP_MILLIS) {
    this.timeouts = /* @__PURE__ */ new Map();
    this.cleanupTimeout = CLEANUP_TIMER_LOOP_MILLIS;
    this.cleanupTimeout = timeout;
  }
  register(object, unsubscribe, unregisterToken) {
    if (!this.timeouts) {
      this.timeouts = /* @__PURE__ */ new Map();
    }
    const timeout = setTimeout(() => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
      this.timeouts.delete(unregisterToken.cleanupToken);
    }, this.cleanupTimeout);
    this.timeouts.set(unregisterToken.cleanupToken, timeout);
  }
  unregister(unregisterToken) {
    const timeout = this.timeouts.get(unregisterToken.cleanupToken);
    if (timeout) {
      this.timeouts.delete(unregisterToken.cleanupToken);
      clearTimeout(timeout);
    }
  }
  reset() {
    if (this.timeouts) {
      this.timeouts.forEach((value, key) => {
        this.unregister({
          cleanupToken: key
        });
      });
      this.timeouts = void 0;
    }
  }
};

// node_modules/@mui/x-tree-view/internals/utils/cleanupTracking/FinalizationRegistryBasedCleanupTracking.js
var FinalizationRegistryBasedCleanupTracking = class {
  constructor() {
    this.registry = new FinalizationRegistry((unsubscribe) => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    });
  }
  register(object, unsubscribe, unregisterToken) {
    this.registry.register(object, unsubscribe, unregisterToken);
  }
  unregister(unregisterToken) {
    this.registry.unregister(unregisterToken);
  }
  // eslint-disable-next-line class-methods-use-this
  reset() {
  }
};

// node_modules/@mui/x-tree-view/internals/hooks/useInstanceEventHandler.js
var ObjectToBeRetainedByReact = class {
};
function createUseInstanceEventHandler(registryContainer2) {
  let cleanupTokensCounter = 0;
  return function useInstanceEventHandler2(instance, eventName, handler) {
    if (registryContainer2.registry === null) {
      registryContainer2.registry = typeof FinalizationRegistry !== "undefined" ? new FinalizationRegistryBasedCleanupTracking() : new TimerBasedCleanupTracking();
    }
    const [objectRetainedByReact] = React11.useState(new ObjectToBeRetainedByReact());
    const subscription = React11.useRef(null);
    const handlerRef = React11.useRef();
    handlerRef.current = handler;
    const cleanupTokenRef = React11.useRef(null);
    if (!subscription.current && handlerRef.current) {
      const enhancedHandler = (params, event) => {
        var _a;
        if (!event.defaultMuiPrevented) {
          (_a = handlerRef.current) == null ? void 0 : _a.call(handlerRef, params, event);
        }
      };
      subscription.current = instance.$$subscribeEvent(eventName, enhancedHandler);
      cleanupTokensCounter += 1;
      cleanupTokenRef.current = {
        cleanupToken: cleanupTokensCounter
      };
      registryContainer2.registry.register(
        objectRetainedByReact,
        // The callback below will be called once this reference stops being retained
        () => {
          var _a;
          (_a = subscription.current) == null ? void 0 : _a.call(subscription);
          subscription.current = null;
          cleanupTokenRef.current = null;
        },
        cleanupTokenRef.current
      );
    } else if (!handlerRef.current && subscription.current) {
      subscription.current();
      subscription.current = null;
      if (cleanupTokenRef.current) {
        registryContainer2.registry.unregister(cleanupTokenRef.current);
        cleanupTokenRef.current = null;
      }
    }
    React11.useEffect(() => {
      if (!subscription.current && handlerRef.current) {
        const enhancedHandler = (params, event) => {
          var _a;
          if (!event.defaultMuiPrevented) {
            (_a = handlerRef.current) == null ? void 0 : _a.call(handlerRef, params, event);
          }
        };
        subscription.current = instance.$$subscribeEvent(eventName, enhancedHandler);
      }
      if (cleanupTokenRef.current && registryContainer2.registry) {
        registryContainer2.registry.unregister(cleanupTokenRef.current);
        cleanupTokenRef.current = null;
      }
      return () => {
        var _a;
        (_a = subscription.current) == null ? void 0 : _a.call(subscription);
        subscription.current = null;
      };
    }, [instance, eventName]);
  };
}
var registryContainer = {
  registry: null
};
var useInstanceEventHandler = createUseInstanceEventHandler(registryContainer);

// node_modules/@mui/x-tree-view/internals/utils/utils.js
var getActiveElement = (root = document) => {
  const activeEl = root.activeElement;
  if (!activeEl) {
    return null;
  }
  if (activeEl.shadowRoot) {
    return getActiveElement(activeEl.shadowRoot);
  }
  return activeEl;
};

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewFocus/useTreeViewFocus.js
var useDefaultFocusableItemId = (instance, selectedItems) => {
  let tabbableItemId = convertSelectedItemsToArray(selectedItems).find((itemId) => {
    if (!instance.isItemNavigable(itemId)) {
      return false;
    }
    const itemMeta = instance.getItemMeta(itemId);
    return itemMeta && (itemMeta.parentId == null || instance.isItemExpanded(itemMeta.parentId));
  });
  if (tabbableItemId == null) {
    tabbableItemId = getFirstNavigableItem(instance);
  }
  return tabbableItemId;
};
var useTreeViewFocus = ({
  instance,
  params,
  state,
  setState,
  models,
  rootRef
}) => {
  const defaultFocusableItemId = useDefaultFocusableItemId(instance, models.selectedItems.value);
  const setFocusedItemId = useEventCallback_default((itemId) => {
    const cleanItemId = typeof itemId === "function" ? itemId(state.focusedItemId) : itemId;
    if (state.focusedItemId !== cleanItemId) {
      setState((prevState) => _extends({}, prevState, {
        focusedItemId: cleanItemId
      }));
    }
  });
  const isTreeViewFocused = React12.useCallback(() => !!rootRef.current && rootRef.current.contains(getActiveElement(ownerDocument(rootRef.current))), [rootRef]);
  const isItemFocused = React12.useCallback((itemId) => state.focusedItemId === itemId && isTreeViewFocused(), [state.focusedItemId, isTreeViewFocused]);
  const isItemVisible = (itemId) => {
    const itemMeta = instance.getItemMeta(itemId);
    return itemMeta && (itemMeta.parentId == null || instance.isItemExpanded(itemMeta.parentId));
  };
  const innerFocusItem = (event, itemId) => {
    const itemElement = instance.getItemDOMElement(itemId);
    if (itemElement) {
      itemElement.focus();
    }
    setFocusedItemId(itemId);
    if (params.onItemFocus) {
      params.onItemFocus(event, itemId);
    }
  };
  const focusItem = useEventCallback_default((event, itemId) => {
    if (isItemVisible(itemId)) {
      innerFocusItem(event, itemId);
    }
  });
  const removeFocusedItem = useEventCallback_default(() => {
    if (state.focusedItemId == null) {
      return;
    }
    const itemMeta = instance.getItemMeta(state.focusedItemId);
    if (itemMeta) {
      const itemElement = document.getElementById(instance.getTreeItemIdAttribute(state.focusedItemId, itemMeta.idAttribute));
      if (itemElement) {
        itemElement.blur();
      }
    }
    setFocusedItemId(null);
  });
  const canItemBeTabbed = (itemId) => itemId === defaultFocusableItemId;
  useInstanceEventHandler(instance, "removeItem", ({
    id
  }) => {
    if (state.focusedItemId === id) {
      innerFocusItem(null, defaultFocusableItemId);
    }
  });
  const createRootHandleFocus = (otherHandlers) => (event) => {
    var _a;
    (_a = otherHandlers.onFocus) == null ? void 0 : _a.call(otherHandlers, event);
    if (event.defaultMuiPrevented) {
      return;
    }
    if (event.target === event.currentTarget) {
      innerFocusItem(event, defaultFocusableItemId);
    }
  };
  return {
    getRootProps: (otherHandlers) => ({
      onFocus: createRootHandleFocus(otherHandlers)
    }),
    publicAPI: {
      focusItem
    },
    instance: {
      isItemFocused,
      canItemBeTabbed,
      focusItem,
      removeFocusedItem
    }
  };
};
useTreeViewFocus.getInitialState = () => ({
  focusedItemId: null
});
useTreeViewFocus.params = {
  onItemFocus: true
};

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewKeyboardNavigation/useTreeViewKeyboardNavigation.js
var React13 = __toESM(require_react());
init_useEventCallback();
function isPrintableCharacter(string) {
  return !!string && string.length === 1 && !!string.match(/\S/);
}
var useTreeViewKeyboardNavigation = ({
  instance,
  params,
  state
}) => {
  const isRtl = useRtl();
  const firstCharMap = React13.useRef({});
  const updateFirstCharMap = useEventCallback_default((callback) => {
    firstCharMap.current = callback(firstCharMap.current);
  });
  React13.useEffect(() => {
    if (instance.areItemUpdatesPrevented()) {
      return;
    }
    const newFirstCharMap = {};
    const processItem = (item) => {
      newFirstCharMap[item.id] = item.label.substring(0, 1).toLowerCase();
    };
    Object.values(state.items.itemMetaMap).forEach(processItem);
    firstCharMap.current = newFirstCharMap;
  }, [state.items.itemMetaMap, params.getItemId, instance]);
  const getFirstMatchingItem = (itemId, query) => {
    const cleanQuery = query.toLowerCase();
    const getNextItem = (itemIdToCheck) => {
      const nextItemId = getNextNavigableItem(instance, itemIdToCheck);
      if (nextItemId === null) {
        return getFirstNavigableItem(instance);
      }
      return nextItemId;
    };
    let matchingItemId = null;
    let currentItemId = getNextItem(itemId);
    const checkedItems = {};
    while (matchingItemId == null && !checkedItems[currentItemId]) {
      if (firstCharMap.current[currentItemId] === cleanQuery) {
        matchingItemId = currentItemId;
      } else {
        checkedItems[currentItemId] = true;
        currentItemId = getNextItem(currentItemId);
      }
    }
    return matchingItemId;
  };
  const canToggleItemSelection = (itemId) => !params.disableSelection && !instance.isItemDisabled(itemId);
  const canToggleItemExpansion = (itemId) => {
    return !instance.isItemDisabled(itemId) && instance.isItemExpandable(itemId);
  };
  const handleItemKeyDown = (event, itemId) => {
    if (event.defaultMuiPrevented) {
      return;
    }
    if (event.altKey || event.currentTarget !== event.target.closest('*[role="treeitem"]')) {
      return;
    }
    const ctrlPressed = event.ctrlKey || event.metaKey;
    const key = event.key;
    switch (true) {
      case (key === " " && canToggleItemSelection(itemId)): {
        event.preventDefault();
        if (params.multiSelect && event.shiftKey) {
          instance.expandSelectionRange(event, itemId);
        } else {
          instance.selectItem({
            event,
            itemId,
            keepExistingSelection: params.multiSelect,
            shouldBeSelected: params.multiSelect ? void 0 : true
          });
        }
        break;
      }
      case key === "Enter": {
        if (canToggleItemExpansion(itemId)) {
          instance.toggleItemExpansion(event, itemId);
          event.preventDefault();
        } else if (canToggleItemSelection(itemId)) {
          if (params.multiSelect) {
            event.preventDefault();
            instance.selectItem({
              event,
              itemId,
              keepExistingSelection: true
            });
          } else if (!instance.isItemSelected(itemId)) {
            instance.selectItem({
              event,
              itemId
            });
            event.preventDefault();
          }
        }
        break;
      }
      case key === "ArrowDown": {
        const nextItem = getNextNavigableItem(instance, itemId);
        if (nextItem) {
          event.preventDefault();
          instance.focusItem(event, nextItem);
          if (params.multiSelect && event.shiftKey && canToggleItemSelection(nextItem)) {
            instance.selectItemFromArrowNavigation(event, itemId, nextItem);
          }
        }
        break;
      }
      case key === "ArrowUp": {
        const previousItem = getPreviousNavigableItem(instance, itemId);
        if (previousItem) {
          event.preventDefault();
          instance.focusItem(event, previousItem);
          if (params.multiSelect && event.shiftKey && canToggleItemSelection(previousItem)) {
            instance.selectItemFromArrowNavigation(event, itemId, previousItem);
          }
        }
        break;
      }
      case (key === "ArrowRight" && !isRtl || key === "ArrowLeft" && isRtl): {
        if (instance.isItemExpanded(itemId)) {
          const nextItemId = getNextNavigableItem(instance, itemId);
          if (nextItemId) {
            instance.focusItem(event, nextItemId);
            event.preventDefault();
          }
        } else if (canToggleItemExpansion(itemId)) {
          instance.toggleItemExpansion(event, itemId);
          event.preventDefault();
        }
        break;
      }
      case (key === "ArrowLeft" && !isRtl || key === "ArrowRight" && isRtl): {
        if (canToggleItemExpansion(itemId) && instance.isItemExpanded(itemId)) {
          instance.toggleItemExpansion(event, itemId);
          event.preventDefault();
        } else {
          const parent = instance.getItemMeta(itemId).parentId;
          if (parent) {
            instance.focusItem(event, parent);
            event.preventDefault();
          }
        }
        break;
      }
      case key === "Home": {
        if (canToggleItemSelection(itemId) && params.multiSelect && ctrlPressed && event.shiftKey) {
          instance.selectRangeFromStartToItem(event, itemId);
        } else {
          instance.focusItem(event, getFirstNavigableItem(instance));
        }
        event.preventDefault();
        break;
      }
      case key === "End": {
        if (canToggleItemSelection(itemId) && params.multiSelect && ctrlPressed && event.shiftKey) {
          instance.selectRangeFromItemToEnd(event, itemId);
        } else {
          instance.focusItem(event, getLastNavigableItem(instance));
        }
        event.preventDefault();
        break;
      }
      case key === "*": {
        instance.expandAllSiblings(event, itemId);
        event.preventDefault();
        break;
      }
      case (key === "a" && ctrlPressed && params.multiSelect && !params.disableSelection): {
        instance.selectAllNavigableItems(event);
        event.preventDefault();
        break;
      }
      case (!ctrlPressed && !event.shiftKey && isPrintableCharacter(key)): {
        const matchingItem = getFirstMatchingItem(itemId, key);
        if (matchingItem != null) {
          instance.focusItem(event, matchingItem);
          event.preventDefault();
        }
        break;
      }
    }
  };
  return {
    instance: {
      updateFirstCharMap,
      handleItemKeyDown
    }
  };
};
useTreeViewKeyboardNavigation.params = {};

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewIcons/useTreeViewIcons.js
var useTreeViewIcons = ({
  slots,
  slotProps
}) => {
  return {
    contextValue: {
      icons: {
        slots: {
          collapseIcon: slots.collapseIcon,
          expandIcon: slots.expandIcon,
          endIcon: slots.endIcon
        },
        slotProps: {
          collapseIcon: slotProps.collapseIcon,
          expandIcon: slotProps.expandIcon,
          endIcon: slotProps.endIcon
        }
      }
    }
  };
};
useTreeViewIcons.params = {};

// node_modules/@mui/x-tree-view/RichTreeView/RichTreeView.plugins.js
var RICH_TREE_VIEW_PLUGINS = [useTreeViewItems, useTreeViewExpansion, useTreeViewSelection, useTreeViewFocus, useTreeViewKeyboardNavigation, useTreeViewIcons];

// node_modules/@mui/x-tree-view/TreeItem/TreeItem.js
init_objectWithoutPropertiesLoose();
init_extends();
var React17 = __toESM(require_react());
var import_prop_types3 = __toESM(require_prop_types());
init_clsx();
init_useForkRef();
var import_createStyled = __toESM(require_createStyled());
init_unsupportedProp();
init_elementTypeAcceptingRef();

// node_modules/@mui/x-tree-view/TreeItem/TreeItemContent.js
init_extends();
init_objectWithoutPropertiesLoose();
var React15 = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());
init_clsx();

// node_modules/@mui/x-tree-view/internals/TreeViewProvider/useTreeViewContext.js
var React14 = __toESM(require_react());
var useTreeViewContext = () => {
  const context = React14.useContext(TreeViewContext);
  if (context == null) {
    throw new Error(["MUI X: Could not find the Tree View context.", "It looks like you rendered your component outside of a SimpleTreeView or RichTreeView parent component.", "This can also happen if you are bundling multiple versions of the Tree View."].join("\n"));
  }
  return context;
};

// node_modules/@mui/x-tree-view/TreeItem/useTreeItemState.js
function useTreeItemState(itemId) {
  const {
    instance,
    selection: {
      multiSelect,
      checkboxSelection,
      disableSelection
    },
    expansion: {
      expansionTrigger
    }
  } = useTreeViewContext();
  const expandable = instance.isItemExpandable(itemId);
  const expanded = instance.isItemExpanded(itemId);
  const focused = instance.isItemFocused(itemId);
  const selected = instance.isItemSelected(itemId);
  const disabled = instance.isItemDisabled(itemId);
  const handleExpansion = (event) => {
    if (!disabled) {
      if (!focused) {
        instance.focusItem(event, itemId);
      }
      const multiple = multiSelect && (event.shiftKey || event.ctrlKey || event.metaKey);
      if (expandable && !(multiple && instance.isItemExpanded(itemId))) {
        instance.toggleItemExpansion(event, itemId);
      }
    }
  };
  const handleSelection = (event) => {
    if (!disabled) {
      if (!focused) {
        instance.focusItem(event, itemId);
      }
      const multiple = multiSelect && (event.shiftKey || event.ctrlKey || event.metaKey);
      if (multiple) {
        if (event.shiftKey) {
          instance.expandSelectionRange(event, itemId);
        } else {
          instance.selectItem({
            event,
            itemId,
            keepExistingSelection: true
          });
        }
      } else {
        instance.selectItem({
          event,
          itemId,
          shouldBeSelected: true
        });
      }
    }
  };
  const handleCheckboxSelection = (event) => {
    if (disableSelection || disabled) {
      return;
    }
    const hasShift = event.nativeEvent.shiftKey;
    if (multiSelect && hasShift) {
      instance.expandSelectionRange(event, itemId);
    } else {
      instance.selectItem({
        event,
        itemId,
        keepExistingSelection: multiSelect,
        shouldBeSelected: event.target.checked
      });
    }
  };
  const preventSelection = (event) => {
    if (event.shiftKey || event.ctrlKey || event.metaKey || disabled) {
      event.preventDefault();
    }
  };
  return {
    disabled,
    expanded,
    selected,
    focused,
    disableSelection,
    checkboxSelection,
    handleExpansion,
    handleSelection,
    handleCheckboxSelection,
    preventSelection,
    expansionTrigger
  };
}

// node_modules/@mui/x-tree-view/TreeItem/TreeItemContent.js
var import_jsx_runtime3 = __toESM(require_jsx_runtime());
var _excluded3 = ["classes", "className", "displayIcon", "expansionIcon", "icon", "label", "itemId", "onClick", "onMouseDown"];
var TreeItemContent = React15.forwardRef(function TreeItemContent2(props, ref) {
  const {
    classes,
    className,
    displayIcon,
    expansionIcon,
    icon: iconProp,
    label,
    itemId,
    onClick,
    onMouseDown
  } = props, other = _objectWithoutPropertiesLoose(props, _excluded3);
  const {
    disabled,
    expanded,
    selected,
    focused,
    disableSelection,
    checkboxSelection,
    handleExpansion,
    handleSelection,
    handleCheckboxSelection,
    preventSelection,
    expansionTrigger
  } = useTreeItemState(itemId);
  const icon = iconProp || expansionIcon || displayIcon;
  const checkboxRef = React15.useRef(null);
  const handleMouseDown = (event) => {
    preventSelection(event);
    if (onMouseDown) {
      onMouseDown(event);
    }
  };
  const handleClick = (event) => {
    var _a;
    if ((_a = checkboxRef.current) == null ? void 0 : _a.contains(event.target)) {
      return;
    }
    if (expansionTrigger === "content") {
      handleExpansion(event);
    }
    if (!checkboxSelection) {
      handleSelection(event);
    }
    if (onClick) {
      onClick(event);
    }
  };
  return (
    /* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions -- Key event is handled by the TreeView */
    (0, import_jsx_runtime3.jsxs)("div", _extends({}, other, {
      className: clsx_default(className, classes.root, expanded && classes.expanded, selected && classes.selected, focused && classes.focused, disabled && classes.disabled),
      onClick: handleClick,
      onMouseDown: handleMouseDown,
      ref,
      children: [(0, import_jsx_runtime3.jsx)("div", {
        className: classes.iconContainer,
        children: icon
      }), checkboxSelection && (0, import_jsx_runtime3.jsx)(Checkbox_default, {
        className: classes.checkbox,
        checked: selected,
        onChange: handleCheckboxSelection,
        disabled: disabled || disableSelection,
        ref: checkboxRef,
        tabIndex: -1
      }), (0, import_jsx_runtime3.jsx)("div", {
        className: classes.label,
        children: label
      })]
    }))
  );
});
true ? TreeItemContent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: import_prop_types.default.object.isRequired,
  className: import_prop_types.default.string,
  /**
   * The icon to display next to the tree item's label. Either a parent or end icon.
   */
  displayIcon: import_prop_types.default.node,
  /**
   * The icon to display next to the tree item's label. Either an expansion or collapse icon.
   */
  expansionIcon: import_prop_types.default.node,
  /**
   * The icon to display next to the tree item's label.
   */
  icon: import_prop_types.default.node,
  /**
   * The id of the item.
   */
  itemId: import_prop_types.default.string.isRequired,
  /**
   * The tree item label.
   */
  label: import_prop_types.default.node
} : void 0;

// node_modules/@mui/x-tree-view/TreeItem/treeItemClasses.js
init_generateUtilityClass();
init_generateUtilityClasses();
function getTreeItemUtilityClass(slot) {
  return generateUtilityClass("MuiTreeItem", slot);
}
var treeItemClasses = generateUtilityClasses("MuiTreeItem", ["root", "groupTransition", "content", "expanded", "selected", "focused", "disabled", "iconContainer", "label", "checkbox"]);

// node_modules/@mui/x-tree-view/icons/icons.js
init_utils();
var React16 = __toESM(require_react());
var import_jsx_runtime4 = __toESM(require_jsx_runtime());
var TreeViewExpandIcon = createSvgIcon((0, import_jsx_runtime4.jsx)("path", {
  d: "M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
}), "TreeViewExpandIcon");
var TreeViewCollapseIcon = createSvgIcon((0, import_jsx_runtime4.jsx)("path", {
  d: "M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"
}), "TreeViewCollapseIcon");

// node_modules/@mui/x-tree-view/TreeItem2Provider/TreeItem2Provider.js
var import_prop_types2 = __toESM(require_prop_types());
function TreeItem2Provider(props) {
  const {
    children,
    itemId
  } = props;
  const {
    wrapItem,
    instance
  } = useTreeViewContext();
  return wrapItem({
    children,
    itemId,
    instance
  });
}
TreeItem2Provider.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: import_prop_types2.default.node,
  itemId: import_prop_types2.default.string.isRequired
};

// node_modules/@mui/x-tree-view/TreeItem/TreeItem.js
var import_jsx_runtime5 = __toESM(require_jsx_runtime());
var _excluded4 = ["children", "className", "slots", "slotProps", "ContentComponent", "ContentProps", "itemId", "id", "label", "onClick", "onMouseDown", "onFocus", "onBlur", "onKeyDown"];
var _excluded22 = ["ownerState"];
var _excluded32 = ["ownerState"];
var _excluded42 = ["ownerState"];
var useThemeProps2 = createUseThemeProps("MuiTreeItem");
var useUtilityClasses = (ownerState) => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ["root"],
    content: ["content"],
    expanded: ["expanded"],
    selected: ["selected"],
    focused: ["focused"],
    disabled: ["disabled"],
    iconContainer: ["iconContainer"],
    checkbox: ["checkbox"],
    label: ["label"],
    groupTransition: ["groupTransition"]
  };
  return composeClasses(slots, getTreeItemUtilityClass, classes);
};
var TreeItemRoot = styled_default("li", {
  name: "MuiTreeItem",
  slot: "Root",
  overridesResolver: (props, styles) => styles.root
})({
  listStyle: "none",
  margin: 0,
  padding: 0,
  outline: 0
});
var StyledTreeItemContent = styled_default(TreeItemContent, {
  name: "MuiTreeItem",
  slot: "Content",
  overridesResolver: (props, styles) => {
    return [styles.content, styles.iconContainer && {
      [`& .${treeItemClasses.iconContainer}`]: styles.iconContainer
    }, styles.label && {
      [`& .${treeItemClasses.label}`]: styles.label
    }];
  },
  shouldForwardProp: (prop) => (0, import_createStyled.shouldForwardProp)(prop) && prop !== "indentationAtItemLevel"
})(({
  theme
}) => ({
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  width: "100%",
  boxSizing: "border-box",
  // prevent width + padding to overflow
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
  "&:hover": {
    backgroundColor: (theme.vars || theme).palette.action.hover,
    // Reset on touch devices, it doesn't add specificity
    "@media (hover: none)": {
      backgroundColor: "transparent"
    }
  },
  [`&.${treeItemClasses.disabled}`]: {
    opacity: (theme.vars || theme).palette.action.disabledOpacity,
    backgroundColor: "transparent"
  },
  [`&.${treeItemClasses.focused}`]: {
    backgroundColor: (theme.vars || theme).palette.action.focus
  },
  [`&.${treeItemClasses.selected}`]: {
    backgroundColor: theme.vars ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.selectedOpacity})` : alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    "&:hover": {
      backgroundColor: theme.vars ? `rgba(${theme.vars.palette.primary.mainChannel} / calc(${theme.vars.palette.action.selectedOpacity} + ${theme.vars.palette.action.hoverOpacity}))` : alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity),
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        backgroundColor: theme.vars ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.selectedOpacity})` : alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
      }
    },
    [`&.${treeItemClasses.focused}`]: {
      backgroundColor: theme.vars ? `rgba(${theme.vars.palette.primary.mainChannel} / calc(${theme.vars.palette.action.selectedOpacity} + ${theme.vars.palette.action.focusOpacity}))` : alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity + theme.palette.action.focusOpacity)
    }
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    width: 16,
    display: "flex",
    flexShrink: 0,
    justifyContent: "center",
    "& svg": {
      fontSize: 18
    }
  },
  [`& .${treeItemClasses.label}`]: _extends({
    width: "100%",
    boxSizing: "border-box",
    // prevent width + padding to overflow
    // fixes overflow - see https://github.com/mui/material-ui/issues/27372
    minWidth: 0,
    position: "relative"
  }, theme.typography.body1),
  [`& .${treeItemClasses.checkbox}`]: {
    padding: 0
  },
  variants: [{
    props: {
      indentationAtItemLevel: true
    },
    style: {
      paddingLeft: `calc(${theme.spacing(1)} + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`
    }
  }]
}));
var TreeItemGroup = styled_default(Collapse_default, {
  name: "MuiTreeItem",
  slot: "GroupTransition",
  overridesResolver: (props, styles) => styles.groupTransition,
  shouldForwardProp: (prop) => (0, import_createStyled.shouldForwardProp)(prop) && prop !== "indentationAtItemLevel"
})({
  margin: 0,
  padding: 0,
  paddingLeft: "var(--TreeView-itemChildrenIndentation)",
  variants: [{
    props: {
      indentationAtItemLevel: true
    },
    style: {
      paddingLeft: 0
    }
  }]
});
var TreeItem = React17.forwardRef(function TreeItem2(inProps, inRef) {
  const {
    icons: contextIcons,
    runItemPlugins,
    selection: {
      multiSelect
    },
    expansion: {
      expansionTrigger
    },
    disabledItemsFocusable,
    indentationAtItemLevel,
    instance
  } = useTreeViewContext();
  const depthContext = React17.useContext(TreeViewItemDepthContext);
  const props = useThemeProps2({
    props: inProps,
    name: "MuiTreeItem"
  });
  const {
    children,
    className,
    slots: inSlots,
    slotProps: inSlotProps,
    ContentComponent = TreeItemContent,
    ContentProps,
    itemId,
    id,
    label,
    onClick,
    onMouseDown,
    onBlur,
    onKeyDown
  } = props, other = _objectWithoutPropertiesLoose(props, _excluded4);
  const {
    expanded,
    focused,
    selected,
    disabled,
    handleExpansion
  } = useTreeItemState(itemId);
  const {
    contentRef,
    rootRef
  } = runItemPlugins(props);
  const handleRootRef = useForkRef(inRef, rootRef);
  const handleContentRef = useForkRef(ContentProps == null ? void 0 : ContentProps.ref, contentRef);
  const slots = {
    expandIcon: (inSlots == null ? void 0 : inSlots.expandIcon) ?? contextIcons.slots.expandIcon ?? TreeViewExpandIcon,
    collapseIcon: (inSlots == null ? void 0 : inSlots.collapseIcon) ?? contextIcons.slots.collapseIcon ?? TreeViewCollapseIcon,
    endIcon: (inSlots == null ? void 0 : inSlots.endIcon) ?? contextIcons.slots.endIcon,
    icon: inSlots == null ? void 0 : inSlots.icon,
    groupTransition: inSlots == null ? void 0 : inSlots.groupTransition
  };
  const isExpandable = (reactChildren) => {
    if (Array.isArray(reactChildren)) {
      return reactChildren.length > 0 && reactChildren.some(isExpandable);
    }
    return Boolean(reactChildren);
  };
  const expandable = isExpandable(children);
  const ownerState = _extends({}, props, {
    expanded,
    focused,
    selected,
    disabled,
    indentationAtItemLevel
  });
  const classes = useUtilityClasses(ownerState);
  const GroupTransition = slots.groupTransition ?? void 0;
  const groupTransitionProps = useSlotProps({
    elementType: GroupTransition,
    ownerState: {},
    externalSlotProps: inSlotProps == null ? void 0 : inSlotProps.groupTransition,
    additionalProps: _extends({
      unmountOnExit: true,
      in: expanded,
      component: "ul",
      role: "group"
    }, indentationAtItemLevel ? {
      indentationAtItemLevel: true
    } : {}),
    className: classes.groupTransition
  });
  const handleIconContainerClick = (event) => {
    if (expansionTrigger === "iconContainer") {
      handleExpansion(event);
    }
  };
  const ExpansionIcon = expanded ? slots.collapseIcon : slots.expandIcon;
  const _useSlotProps = useSlotProps({
    elementType: ExpansionIcon,
    ownerState: {},
    externalSlotProps: (tempOwnerState) => {
      if (expanded) {
        return _extends({}, resolveComponentProps(contextIcons.slotProps.collapseIcon, tempOwnerState), resolveComponentProps(inSlotProps == null ? void 0 : inSlotProps.collapseIcon, tempOwnerState));
      }
      return _extends({}, resolveComponentProps(contextIcons.slotProps.expandIcon, tempOwnerState), resolveComponentProps(inSlotProps == null ? void 0 : inSlotProps.expandIcon, tempOwnerState));
    },
    additionalProps: {
      onClick: handleIconContainerClick
    }
  }), expansionIconProps = _objectWithoutPropertiesLoose(_useSlotProps, _excluded22);
  const expansionIcon = expandable && !!ExpansionIcon ? (0, import_jsx_runtime5.jsx)(ExpansionIcon, _extends({}, expansionIconProps)) : null;
  const DisplayIcon = expandable ? void 0 : slots.endIcon;
  const _useSlotProps2 = useSlotProps({
    elementType: DisplayIcon,
    ownerState: {},
    externalSlotProps: (tempOwnerState) => {
      if (expandable) {
        return {};
      }
      return _extends({}, resolveComponentProps(contextIcons.slotProps.endIcon, tempOwnerState), resolveComponentProps(inSlotProps == null ? void 0 : inSlotProps.endIcon, tempOwnerState));
    }
  }), displayIconProps = _objectWithoutPropertiesLoose(_useSlotProps2, _excluded32);
  const displayIcon = DisplayIcon ? (0, import_jsx_runtime5.jsx)(DisplayIcon, _extends({}, displayIconProps)) : null;
  const Icon = slots.icon;
  const _useSlotProps3 = useSlotProps({
    elementType: Icon,
    ownerState: {},
    externalSlotProps: inSlotProps == null ? void 0 : inSlotProps.icon
  }), iconProps = _objectWithoutPropertiesLoose(_useSlotProps3, _excluded42);
  const icon = Icon ? (0, import_jsx_runtime5.jsx)(Icon, _extends({}, iconProps)) : null;
  let ariaSelected;
  if (multiSelect) {
    ariaSelected = selected;
  } else if (selected) {
    ariaSelected = true;
  }
  function handleFocus(event) {
    const canBeFocused = !disabled || disabledItemsFocusable;
    if (!focused && canBeFocused && event.currentTarget === event.target) {
      instance.focusItem(event, itemId);
    }
  }
  function handleBlur(event) {
    onBlur == null ? void 0 : onBlur(event);
    instance.removeFocusedItem();
  }
  const handleKeyDown = (event) => {
    onKeyDown == null ? void 0 : onKeyDown(event);
    instance.handleItemKeyDown(event, itemId);
  };
  const idAttribute = instance.getTreeItemIdAttribute(itemId, id);
  const tabIndex = instance.canItemBeTabbed(itemId) ? 0 : -1;
  return (0, import_jsx_runtime5.jsx)(TreeItem2Provider, {
    itemId,
    children: (0, import_jsx_runtime5.jsxs)(TreeItemRoot, _extends({
      className: clsx_default(classes.root, className),
      role: "treeitem",
      "aria-expanded": expandable ? expanded : void 0,
      "aria-selected": ariaSelected,
      "aria-disabled": disabled || void 0,
      id: idAttribute,
      tabIndex
    }, other, {
      ownerState,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      ref: handleRootRef,
      style: indentationAtItemLevel ? _extends({}, other.style, {
        "--TreeView-itemDepth": typeof depthContext === "function" ? depthContext(itemId) : depthContext
      }) : other.style,
      children: [(0, import_jsx_runtime5.jsx)(StyledTreeItemContent, _extends({
        as: ContentComponent,
        classes: {
          root: classes.content,
          expanded: classes.expanded,
          selected: classes.selected,
          focused: classes.focused,
          disabled: classes.disabled,
          iconContainer: classes.iconContainer,
          label: classes.label,
          checkbox: classes.checkbox
        },
        label,
        itemId,
        onClick,
        onMouseDown,
        icon,
        expansionIcon,
        displayIcon,
        ownerState
      }, ContentProps, {
        ref: handleContentRef
      })), children && (0, import_jsx_runtime5.jsx)(TreeItemGroup, _extends({
        as: GroupTransition
      }, groupTransitionProps, {
        children
      }))]
    }))
  });
});
true ? TreeItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The content of the component.
   */
  children: import_prop_types3.default.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: import_prop_types3.default.object,
  className: import_prop_types3.default.string,
  /**
   * The component used to render the content of the item.
   * @default TreeItemContent
   */
  ContentComponent: elementTypeAcceptingRef_default,
  /**
   * Props applied to ContentComponent.
   */
  ContentProps: import_prop_types3.default.object,
  /**
   * If `true`, the item is disabled.
   * @default false
   */
  disabled: import_prop_types3.default.bool,
  /**
   * The id of the item.
   */
  itemId: import_prop_types3.default.string.isRequired,
  /**
   * The tree item label.
   */
  label: import_prop_types3.default.node,
  /**
   * This prop isn't supported.
   * Use the `onItemFocus` callback on the tree if you need to monitor a item's focus.
   */
  onFocus: unsupportedProp,
  /**
   * Callback fired when a key of the keyboard is pressed on the item.
   */
  onKeyDown: import_prop_types3.default.func,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: import_prop_types3.default.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: import_prop_types3.default.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: import_prop_types3.default.oneOfType([import_prop_types3.default.arrayOf(import_prop_types3.default.oneOfType([import_prop_types3.default.func, import_prop_types3.default.object, import_prop_types3.default.bool])), import_prop_types3.default.func, import_prop_types3.default.object])
} : void 0;

// node_modules/@mui/x-tree-view/internals/utils/warning.js
var buildWarning = (message, gravity = "warning") => {
  let alreadyWarned = false;
  const cleanMessage = Array.isArray(message) ? message.join("\n") : message;
  return () => {
    if (!alreadyWarned) {
      alreadyWarned = true;
      if (gravity === "error") {
        console.error(cleanMessage);
      } else {
        console.warn(cleanMessage);
      }
    }
  };
};

// node_modules/@mui/x-tree-view/RichTreeView/RichTreeView.js
var import_jsx_runtime6 = __toESM(require_jsx_runtime());
var useThemeProps3 = createUseThemeProps("MuiRichTreeView");
var useUtilityClasses2 = (ownerState) => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ["root"]
  };
  return composeClasses(slots, getRichTreeViewUtilityClass, classes);
};
var RichTreeViewRoot = styled_default("ul", {
  name: "MuiRichTreeView",
  slot: "Root",
  overridesResolver: (props, styles) => styles.root
})({
  padding: 0,
  margin: 0,
  listStyle: "none",
  outline: 0,
  position: "relative"
});
function WrappedTreeItem({
  slots,
  slotProps,
  label,
  id,
  itemId,
  children
}) {
  const Item = (slots == null ? void 0 : slots.item) ?? TreeItem;
  const itemProps = useSlotProps({
    elementType: Item,
    externalSlotProps: slotProps == null ? void 0 : slotProps.item,
    additionalProps: {
      itemId,
      id,
      label
    },
    ownerState: {
      itemId,
      label
    }
  });
  return (0, import_jsx_runtime6.jsx)(Item, _extends({}, itemProps, {
    children
  }));
}
var childrenWarning = buildWarning(["MUI X: The `RichTreeView` component does not support JSX children.", "If you want to add items, you need to use the `items` prop", "Check the documentation for more details: https://mui.com/x/react-tree-view/rich-tree-view/items/"]);
var RichTreeView = React18.forwardRef(function RichTreeView2(inProps, ref) {
  const props = useThemeProps3({
    props: inProps,
    name: "MuiRichTreeView"
  });
  if (true) {
    if (props.children != null) {
      childrenWarning();
    }
  }
  const {
    getRootProps,
    contextValue,
    instance
  } = useTreeView({
    plugins: RICH_TREE_VIEW_PLUGINS,
    rootRef: ref,
    props
  });
  const {
    slots,
    slotProps
  } = props;
  const classes = useUtilityClasses2(props);
  const Root = (slots == null ? void 0 : slots.root) ?? RichTreeViewRoot;
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps == null ? void 0 : slotProps.root,
    className: classes.root,
    getSlotProps: getRootProps,
    ownerState: props
  });
  const itemsToRender = instance.getItemsToRender();
  const renderItem = ({
    label,
    itemId,
    id,
    children
  }) => {
    return (0, import_jsx_runtime6.jsx)(WrappedTreeItem, {
      slots,
      slotProps,
      label,
      id,
      itemId,
      children: children == null ? void 0 : children.map(renderItem)
    }, itemId);
  };
  return (0, import_jsx_runtime6.jsx)(TreeViewProvider, {
    value: contextValue,
    children: (0, import_jsx_runtime6.jsx)(Root, _extends({}, rootProps, {
      children: itemsToRender.map(renderItem)
    }))
  });
});
true ? RichTreeView.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The ref object that allows Tree View manipulation. Can be instantiated with `useTreeViewApiRef()`.
   */
  apiRef: import_prop_types4.default.shape({
    current: import_prop_types4.default.shape({
      focusItem: import_prop_types4.default.func.isRequired,
      getItem: import_prop_types4.default.func.isRequired,
      getItemDOMElement: import_prop_types4.default.func.isRequired,
      getItemOrderedChildrenIds: import_prop_types4.default.func.isRequired,
      getItemTree: import_prop_types4.default.func.isRequired,
      selectItem: import_prop_types4.default.func.isRequired,
      setItemExpansion: import_prop_types4.default.func.isRequired
    })
  }),
  /**
   * If `true`, the tree view renders a checkbox at the left of its label that allows selecting it.
   * @default false
   */
  checkboxSelection: import_prop_types4.default.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: import_prop_types4.default.object,
  className: import_prop_types4.default.string,
  /**
   * Expanded item ids.
   * Used when the item's expansion is not controlled.
   * @default []
   */
  defaultExpandedItems: import_prop_types4.default.arrayOf(import_prop_types4.default.string),
  /**
   * Selected item ids. (Uncontrolled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   * @default []
   */
  defaultSelectedItems: import_prop_types4.default.any,
  /**
   * If `true`, will allow focus on disabled items.
   * @default false
   */
  disabledItemsFocusable: import_prop_types4.default.bool,
  /**
   * If `true` selection is disabled.
   * @default false
   */
  disableSelection: import_prop_types4.default.bool,
  /**
   * Expanded item ids.
   * Used when the item's expansion is controlled.
   */
  expandedItems: import_prop_types4.default.arrayOf(import_prop_types4.default.string),
  /**
   * The slot that triggers the item's expansion when clicked.
   * @default 'content'
   */
  expansionTrigger: import_prop_types4.default.oneOf(["content", "iconContainer"]),
  /**
   * Unstable features, breaking changes might be introduced.
   * For each feature, if the flag is not explicitly set to `true`,
   * the feature will be fully disabled and any property / method call will not have any effect.
   */
  experimentalFeatures: import_prop_types4.default.shape({
    indentationAtItemLevel: import_prop_types4.default.bool
  }),
  /**
   * Used to determine the id of a given item.
   *
   * @template R
   * @param {R} item The item to check.
   * @returns {string} The id of the item.
   * @default (item) => item.id
   */
  getItemId: import_prop_types4.default.func,
  /**
   * Used to determine the string label for a given item.
   *
   * @template R
   * @param {R} item The item to check.
   * @returns {string} The label of the item.
   * @default (item) => item.label
   */
  getItemLabel: import_prop_types4.default.func,
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id: import_prop_types4.default.string,
  /**
   * Used to determine if a given item should be disabled.
   * @template R
   * @param {R} item The item to check.
   * @returns {boolean} `true` if the item should be disabled.
   */
  isItemDisabled: import_prop_types4.default.func,
  /**
   * Horizontal indentation between an item and its children.
   * Examples: 24, "24px", "2rem", "2em".
   * @default 12px
   */
  itemChildrenIndentation: import_prop_types4.default.oneOfType([import_prop_types4.default.number, import_prop_types4.default.string]),
  items: import_prop_types4.default.array.isRequired,
  /**
   * If `true`, `ctrl` and `shift` will trigger multiselect.
   * @default false
   */
  multiSelect: import_prop_types4.default.bool,
  /**
   * Callback fired when tree items are expanded/collapsed.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {array} itemIds The ids of the expanded items.
   */
  onExpandedItemsChange: import_prop_types4.default.func,
  /**
   * Callback fired when a tree item is expanded or collapsed.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {array} itemId The itemId of the modified item.
   * @param {array} isExpanded `true` if the item has just been expanded, `false` if it has just been collapsed.
   */
  onItemExpansionToggle: import_prop_types4.default.func,
  /**
   * Callback fired when tree items are focused.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change. **Warning**: This is a generic event not a focus event.
   * @param {string} itemId The id of the focused item.
   * @param {string} value of the focused item.
   */
  onItemFocus: import_prop_types4.default.func,
  /**
   * Callback fired when a tree item is selected or deselected.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {array} itemId The itemId of the modified item.
   * @param {array} isSelected `true` if the item has just been selected, `false` if it has just been deselected.
   */
  onItemSelectionToggle: import_prop_types4.default.func,
  /**
   * Callback fired when tree items are selected/deselected.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {string[] | string} itemIds The ids of the selected items.
   * When `multiSelect` is `true`, this is an array of strings; when false (default) a string.
   */
  onSelectedItemsChange: import_prop_types4.default.func,
  /**
   * Selected item ids. (Controlled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   */
  selectedItems: import_prop_types4.default.any,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: import_prop_types4.default.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: import_prop_types4.default.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: import_prop_types4.default.oneOfType([import_prop_types4.default.arrayOf(import_prop_types4.default.oneOfType([import_prop_types4.default.func, import_prop_types4.default.object, import_prop_types4.default.bool])), import_prop_types4.default.func, import_prop_types4.default.object])
} : void 0;
export {
  RICH_TREE_VIEW_PLUGINS,
  RichTreeView,
  RichTreeViewRoot,
  getRichTreeViewUtilityClass,
  richTreeViewClasses
};
//# sourceMappingURL=@mui_x-tree-view_RichTreeView.js.map
