import React from "react"
import {Chart} from "react-google-charts"

class CategoriesChart extends React.Component {

    render() {
        let gid = this.props.gid
        let cats = this.props.cats
        let expenses = this.props.expenses
        let rows = []
        rows.push(["Category", "Amount"])

        cats.map(cat=> {
            let total = 0
            expenses.map(expense=> {
                if (expense.doCount && expense.myShare.cat === cat._id || expense.myShare.subcat === cat._id) {
                    total += expense.myShare.amount
                }
            })
            rows.push([cat.label, total])
        })
        let totalnd = 0
        expenses.map(expense=> {
            if (expense.doCount && !expense.myShare.cat && !expense.myShare.subcat) {
                totalnd += expense.myShare.amount
            }
        })
        if (totalnd > 0) {
            rows.push(["(no category)", totalnd])
        }
        var options = {'chartArea': {'width': '85%', 'height': '85%'}}

        return <Chart chartType="PieChart"
                      data={rows}
                      options={options}
                      graph_id={gid}
                      width={"100%"} height={"350px"}
                      legend_toggle={true}/>
    }
}

export default CategoriesChart