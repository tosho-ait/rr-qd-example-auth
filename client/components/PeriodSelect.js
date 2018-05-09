import React from "react"
import moment from "moment"

class PeriodSelect extends React.Component {

    constructor(props) {
        super(props)
        this._plus = this._plus.bind(this)
        this._minus = this._minus.bind(this)
        this._modeY = this._modeY.bind(this)
        this._modeM = this._modeM.bind(this)
        this._modeD = this._modeD.bind(this)
        this._calcLabel = this._calcLabel.bind(this)
    }

    pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    _plus(event) {
        event.preventDefault();
        event.stopPropagation();
        const {mode, year, day, month} = this.props.value;
        let date = moment.utc(this.pad(day, 2) + "-" + this.pad(month, 2) + "-" + year, "DD-MM-YYYY", true);
        if ('y' === mode) {
            date.add(1, 'y');
        } else if ('m' === mode) {
            date.add(1, 'month');
        } else {
            date.add(1, 'days');
        }
        this._calcLabel(mode, date.year(), (date.month() + 1), (date.date()))
    }

    _minus(event) {
        event.preventDefault();
        event.stopPropagation();
        const {mode, year, day, month} = this.props.value;
        let date = moment.utc(this.pad(day, 2) + "-" + this.pad(month, 2) + "-" + year, "DD-MM-YYYY", true);
        if ('y' === mode) {
            date.add(-1, 'y');
        } else if ('m' === mode) {
            date.add(-1, 'month');
        } else {
            date.add(-1, 'days');
        }
        this._calcLabel(mode, date.year(), (date.month() + 1), (date.date()))
    }

    _modeY(event) {
        event.preventDefault();
        const {year, month, day} = this.props.value;
        this._calcLabel('y', year, month, day)
    }

    _modeM(event) {
        event.preventDefault();
        const {year, month, day} = this.props.value;
        this._calcLabel('m', year, month, day)
    }

    _modeD(event) {
        event.preventDefault();
        const {year, month, day} = this.props.value;
        this._calcLabel('d', year, month, day)
    }

    _calcLabel(mode, year, month, day) {
        const {onChange} = this.props;
        let label = year + ''
        if ('m' === mode) {
            label = month + '/' + year
        } else if ('d' === mode) {
            label = day + '/' + month + '/' + year
        }
        onChange({mode, year, month, day, label})
    }

    render() {
        return <div>
            <div class="input-group">
                <span class="input-group-btn">
                    <button class="btn btn-default whiteButton" type="button" onClick={this._minus}>
                            <span class="glyphicon glyphicon-chevron-left"> </span></button>
                    <button class="btn btn-default whiteButton" type="button" onClick={this._plus}>
                            <span class="glyphicon glyphicon-chevron-right"> </span></button>
                </span>
                <span>
                    <input type="text" class="form-control whiteButton text-center" value={this.props.value.label}/>
                </span>
                <span class="input-group-btn">
                    <button class="btn btn-default whiteButton" type="button"
                            onClick={this._modeY}><strong>Y</strong></button>
                    <button class="btn btn-default whiteButton" type="button"
                            onClick={this._modeM}><strong>M</strong></button>
                    <button class="btn btn-default whiteButton" type="button"
                            onClick={this._modeD}><strong>D</strong></button>
                </span>
            </div>
        </div>
    }
}

export default PeriodSelect