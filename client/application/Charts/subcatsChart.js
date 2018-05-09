import React from "react"
import {Chart} from "react-google-charts"

class SubcatsChart extends React.Component {

    render() {
        let gid = this.props.gid
        let catid = this.props.catid
        let subcats = this.props.subcats
        let expenses = this.props.expenses
        let rows = []
        let ttotal = 0
        rows.push(["Category", "Amount"])
        subcats && subcats.map(subcat => {
            let total = 0;
            expenses.map(expense=> {
                if (expense.doCount && expense.myShare.cat === catid && expense.myShare.subcat === subcat._id) {
                    total += expense.myShare.amount
                }
            })
            ttotal += total
            rows.push([subcat.label, total])
        })
        let totalnd = 0
        expenses.map(expense=> {
            if (expense.doCount && expense.myShare.cat === catid) {
                totalnd += expense.myShare.amount
            }
        })
        totalnd = totalnd - ttotal
        if (totalnd > 0) {
            rows.push(["(no subcategory)", totalnd])
        }
        var options = {'chartArea': {'width': '85%', 'height': '85%'}}

        return <div key={catid}>
            <Chart chartType="PieChart"
                   data={rows}
                   options={options}
                   graph_id={gid}
                   width={"100%"} height={"350px"}
                   legend_toggle={true}/>
        </div>
    }
}


export default SubcatsChart