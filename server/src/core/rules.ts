export function applyRules(input: any): any {
    if (!input) {
        throw new Error("Invalid input");
    }

    return {
        ...input,
        processedAt: new Date().toISOString(),
    };
}