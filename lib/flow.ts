import type {Goal} from "./decision";
/** Dynamic quiz: exclude irrelevant running/noise screens for strength-only buyers. */
export function visibleScreens(goal:Goal):number[]{
 return goal==="strength"?[0,1,4,5]:[0,1,2,3,4,5];
}
