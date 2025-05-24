import { DialogPanel } from "./panel.js";
import { DialogRoot } from "./root.js";
import { DialogTrigger } from "./trigger.js";

export const Dialog = {
  Root: DialogRoot,
  Panel: DialogPanel,
  Trigger: DialogTrigger,
};

export type { DialogApi, DialogRootProps } from "./root.js";

/**
 * <root>  done
 *  <trigger> done
 *  <portal>
 *    <panel> done
 *      <title />
 *      <description />
 *    </panel> done
 *  </portal>
 * </root> done
 */
