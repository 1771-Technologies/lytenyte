import { DialogPanel } from "./dialog.js";
import { DialogRoot } from "./root.js";

export const Dialog = {
  Root: DialogRoot,
  Panel: DialogPanel,
};

export type { DialogApi, DialogRootProps } from "./root.js";

/**
 * <root>  done
 *  <trigger>
 *  <portal>
 *    <panel> done
 *      <title />
 *      <description />
 *    </panel> done
 *  </portal>
 * </root> done
 */
