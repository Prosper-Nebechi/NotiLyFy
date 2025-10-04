import { applyRules } from "./rules";
import { renderResponse } from "./renderer";

export function orchestrate(input: any): any {
    const processed = applyRules(input);

    return renderResponse(processed);
}