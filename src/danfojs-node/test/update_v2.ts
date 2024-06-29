import * as dfd from '../src'
let data = [[1, 1, 2, 2], [1, 5, 6, 8], [20, 30, 40, 60], [20, 89, 78, 70]];
let cols = ["A", "B", "C", "D"];
let df:any = new dfd.DataFrame(data, { columns: cols });

df.addColumn("E", 5, {inplace: true})
df.print()

df.addColumn("F", df['A'].shift(2), {inplace: true})
df.print()

df.addColumn("K", df['A'].rolling(3).sum(), {inplace: true})
df.print()

let grouped = df.groupby('A').agg({
    B: 'last',
    C: 'first',
    D: 'mean',
    E: 'sum'
})
grouped.print()




