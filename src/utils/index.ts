const inputEquals = (prev: unknown[], current: unknown[]): boolean => {
    if (prev.length !== current.length) {
        return false;
    }

    // tslint:disable-next-line:no-increment-decrement
    for (let i = 0; i < prev.length; i++) {
        if (prev[i] !== current[i]) {
            return false;
        }
    }

    return true;
};

declare type BasicFunction = (...args: any) => any;

export const createMemoizer = <Select extends BasicFunction>(
    select: Select
): ((...input: any) => ReturnType<Select>) => {
    let lastInput: any = null;
    let lastResult: ReturnType<Select> = null as unknown as ReturnType<Select>;

    return (...input) => {
        if (!lastInput || !inputEquals(lastInput, input)) {
            lastResult = select(...input);
            lastInput = input;
        }

        return lastResult;
    };
};
