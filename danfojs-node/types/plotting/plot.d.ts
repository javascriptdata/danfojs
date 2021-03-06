/**
 * Plotting methods and Functions performed on Series and DataFrames
 */
export class Plot {
    constructor(ndframe?: any, div?: any);
    div?: any;
    ndframe?: any;
    /**
     * Plot Series or DataFrame as lines. This function is useful to plot lines using DataFrame’s values as coordinates.
    * Make plots of Series or DataFrame.
    * Uses the Plotly as backend, so supoorts Plotly's configuration parameters
    * @param {string} div Name of the div to show the plot
    * @param {Object} config configuration options for making Plots, supports Plotly parameters
     */
    line(config?: any): void;
    /**
    * Plot Series or DataFrame as Bars.
   * Uses the Plotly as backend, so supoorts Plotly's configuration parameters
   * @param {string} div Name of the div to show the plot
   * @param {Object} config configuration options for making Plots, supports Plotly parameters
    */
    bar(config?: any): void;
    /**
    * Plot two or more columns in a DataFrame as scatter points. If Series, plot against its index
   * Uses the Plotly as backend, so supoorts Plotly's configuration parameters
   * @param {string} div Name of the div to show the plot
   * @param {Object} config configuration options for making Plots, supports Plotly parameters
    */
    scatter(config?: any): void;
    /**
    * Plot columns in a Series/DataFrame as Histograms.
   * Uses the Plotly as backend, so supoorts Plotly's configuration parameters
   * @param {string} div Name of the div to show the plot
   * @param {Object} config configuration options for making Plots, supports Plotly parameters
    */
    hist(config?: any): void;
    /**
    * Makes Pie Plots from two Columns in a DataFrame.
   * Uses the Plotly as backend, so supoorts Plotly's configuration parameters
   * @param {string} div Name of the div to show the plot
   * @param {Object} config configuration options for making Plots, supports Plotly parameters
    */
    pie(config?: any): void;
    /**
     * Plot Box plots from Series or DataFrame as lines.
    * Uses the Plotly as backend, so supoorts Plotly's configuration parameters
    * @param {Object} config configuration options for making Plots, supports Plotly parameters
     */
    box(config?: any): void;
    /**
    * Plot Violin plots from Series or DataFrame as lines.
   * Uses the Plotly as backend, so supoorts Plotly's configuration parameters
   * @param {Object} config configuration options for making Plots, supports Plotly parameters
    */
    violin(config?: any): void;
    /**
    * Display DataFrame in a div using D3.js format
   * Uses the Plotly as backend, so supoorts Plotly's configuration parameters
   * @param {Object} config configuration options for making Plots, supports Plotly parameters
    */
    table(config?: any): void;
    __get_plot_params(config?: any): (string[] | {
        layout: {};
    })[];
    ____check_if_cols_exist(cols?: any): any;
}
