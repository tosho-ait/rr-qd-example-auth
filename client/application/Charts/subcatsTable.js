import React from "react"
import PagedTable from "../../fancy/components/PagedTable"

class SubcatsTable extends React.Component {

    render() {
        let catid = this.props.catid
        let subcats = this.props.subcats
        let expenses = this.props.expenses
        let daysBetween = this.props.daysBetween

        let body = []

        let ttotal = 0
        let tavg = 0

        subcats && subcats.map(subcat => {
            let total = 0
            expenses.map(expense => {
                if (expense.doCount && expense.myShare.cat === catid && expense.myShare.subcat === subcat._id) {
                    total += expense.myShare.amount
                }
            })
            ttotal += total
            let avg = 0
            if (daysBetween > 0 && total > 0) {
                avg = (total / daysBetween)
                tavg += avg
            }
            body.push({
                cells: [{value: subcat.label}, {
                    classes: 'text-right',
                    value: <span>
                        {daysBetween > 1 && avg.toFixed(2)}
                        {daysBetween > 30 && <span> / {(avg * 30).toFixed(2)}</span>}
                    </span>
                }, {classes: 'text-right', value: total.toFixed(2)}]
            })
        })

        let totalnd = 0
        expenses.map(expense => {
            if (expense.doCount && expense.myShare.cat === catid) {
                totalnd += expense.myShare.amount
            }
        })
        totalnd = totalnd - ttotal
        if (totalnd > 0) {
            let avgnd = (totalnd / daysBetween)
            tavg += avgnd
            body.push({
                cells: [{value: "(no subcategory)"}, {
                    classes: 'text-right',
                    value: <span>
                        {daysBetween > 1 && avgnd.toFixed(2)}
                        {daysBetween > 30 && <span> / {(avgnd * 30).toFixed(2)}</span>}
                    </span>
                }, {classes: 'text-right', value: totalnd.toFixed(2)}]
            })
            ttotal += totalnd
        }

        body = body.sort((a, b)=>Number(b.cells.slice(-1)[0].value) - Number(a.cells.slice(-1)[0].value))
        let header = [[
            {title: "category"},
            {
                title: <span>
                    {daysBetween > 1 && daysBetween + " days average"}
                    {daysBetween > 30 && <span><br /> day / 30 days</span>}
                </span>, classes: 'text-right', width: 150
            },
            {title: "amount", classes: 'text-right', width: 90}
        ], [
            {title: "TOTAL"},
            {
                title: <span>
                        {daysBetween > 1 && tavg.toFixed(2)}
                    {daysBetween > 30 && <span> / {(tavg * 30).toFixed(2)}</span>}
            </span>, classes: 'text-right', width: 150
            },
            {title: ttotal.toFixed(2), classes: 'text-right', width: 90}
        ]]
        return <PagedTable header={header} body={body}/>
    }
}

export default SubcatsTable