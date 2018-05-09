import React from "react"
import {reduxForm} from "redux-form"
import NavBar from "../../components/NavBar"
import FancyListAL from "../../fancy/components/FancyListAL"
import {categoryFormSubmit} from "../../actions/api"


class CategoryForm extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {fields: {_id, label, toDelete, subcats, delCat, delSubcat}, handleSubmit, error, submitting} = this.props

        let subcatsToDel = subcats.filter(subcat => subcat.toDelete.value).map(subcat => subcat._id.value)

        return <div>
            <NavBar />
            <div class="container">
                <form onSubmit={handleSubmit}>
                    <div class="row">
                        <div class="col-md-10 col-md-offset-1"><h2>Category</h2></div>
                        <div class="col-md-10 col-md-offset-1">
                            <hr />
                        </div>
                        <div class="col-md-10 col-md-offset-1">
                            {error && <div class="alert alert-danger"> {error} </div>}
                        </div>
                        <div class="col-sm-8 col-sm-offset-2">
                            <div class="row">
                                <div class="col-xs-8">
                                    <div class="form-group">
                                        <label>Category Label</label>
                                        <p class="form-group">
                                            <input type="text" class="form-control" {...label}/>
                                        </p>
                                    </div>
                                </div>
                                <div class="col-xs-4 text-right">
                                    <label>&nbsp;</label>
                                    <div>
                                        {!toDelete.value &&
                                        <button type="submit" disabled={submitting}
                                                onClick={e => {
                                                    e.preventDefault()
                                                    toDelete.onChange(true)
                                                } }
                                                class="btn btn-default">
                                            <span><span class="glyphicon glyphicon-remove"/>&nbsp;Delete Category</span>
                                        </button>}
                                        {toDelete.value &&
                                        <button type="submit" disabled={submitting}
                                                onClick={e => {
                                                    e.preventDefault()
                                                    toDelete.onChange(false)
                                                } }
                                                class="btn btn-default">
                                            <span><span class="glyphicon glyphicon-repeat"/>&nbsp;Do Not Delete</span>
                                        </button>}
                                    </div>
                                </div>
                                {toDelete.value && <div class="col-xs-12">
                                    <div class="row">
                                        <div class="col-xs-1"></div>
                                        <div class="col-xs-11 text-danger mb10">
                                            Category will be deleted! Move existing expenses to:
                                        </div>
                                        <div class="col-xs-1"></div>
                                        <div class="col-xs-5">
                                            <div class="form-group">
                                                <label>category</label>
                                                <FancyListAL listName="cats"
                                                             placeholder="category"
                                                             excludeOptions={[_id.value]}
                                                             {...delCat} />
                                            </div>
                                        </div>
                                        <div class="col-xs-5">
                                            <div class="form-group">
                                                <label>subcategory</label>
                                                <FancyListAL listName="subcats"
                                                             placeholder="subcategory"
                                                             {...delSubcat}
                                                             filterListName="cats"
                                                             filterValue={delCat.value}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                            </div>
                            <div class="row">
                                <div class="col-xs-12">
                                    <br />
                                    <button type="button"
                                            class="btn btn-default"
                                            onClick={() => {
                                                subcats.addField()
                                            }}>
                                        <span class="glyphicon glyphicon-plus"/>&nbsp;Add Subcategory
                                    </button>
                                    <br />
                                    <br />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-10 col-md-offset-1"><h2>Subcategories</h2></div>
                        <div class="col-md-10 col-md-offset-1">
                            <hr />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-8 col-sm-offset-2">
                            <div class="row">
                            </div>
                            {!subcats.length &&
                            <div><br />No Subcategories Defined.<br /><br /></div>}
                            {subcats.map((child, index) =>
                                <div class="row">
                                    <div class="col-xs-8">
                                        <div class="form-group">
                                            <label>Subcategory Label</label>
                                            <p class="form-group">
                                                <input type="text" class="form-control" {...child.label}/>
                                            </p>
                                        </div>
                                    </div>
                                    {!child.toDelete.value &&
                                    <div class="col-xs-4 text-right">
                                        <label>&nbsp;</label>
                                        <div>
                                            <button type="button" class="btn btn-default" onClick={() => {
                                                if (child._id.value) {
                                                    child.toDelete.onChange(true)
                                                } else {
                                                    subcats.removeField(index)
                                                }
                                            }}>
                                                <span class="glyphicon glyphicon-remove"/>&nbsp;Delete Subcategory
                                            </button>
                                        </div>
                                    </div>}
                                    {child.toDelete.value &&
                                    <div class="col-xs-4 text-right">
                                        <label>&nbsp;</label>
                                        <div>
                                            <button type="button" class="btn btn-default" onClick={() => {
                                                child.toDelete.onChange(false)
                                            }}>
                                                <span class="glyphicon glyphicon-repeat"/>&nbsp;Do Not Delete
                                            </button>
                                        </div>
                                    </div>}
                                    {child.toDelete.value &&
                                    <div class="col-xs-12">
                                        <div class="row">
                                            <div class="col-xs-1"></div>
                                            <div class="col-xs-11 text-danger mb10">
                                                Subcategory will be deleted! Move existing expenses to:
                                            </div>
                                            <div class="col-xs-1"></div>
                                            <div class="col-xs-5">
                                                <div class="form-group">
                                                    <label>category</label>
                                                    <FancyListAL listName="cats"
                                                                 placeholder="category"
                                                                 {...child.delCat} />
                                                </div>
                                            </div>
                                            <div class="col-xs-5">
                                                <div class="form-group">
                                                    <label>subcategory</label>
                                                    <FancyListAL listName="subcats"
                                                                 placeholder="subcategory"
                                                                 {...child.delSubcat}
                                                                 filterListName="cats"
                                                                 excludeOptions={subcatsToDel}
                                                                 filterValue={child.delCat.value}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>}
                                    {index < subcats.length - 1 &&
                                    <div class="col-xs-4 text-right"><br /><br /></div>}
                                </div>)}
                        </div>
                        <div class="col-md-10 col-md-offset-1">
                            <hr />
                        </div>
                        <div class="col-sm-4 col-sm-offset-2">
                        </div>
                        <div class="col-sm-4 text-right">
                            <button type="submit"
                                    disabled={submitting}
                                    onClick={handleSubmit}
                                    class="btn btn-default">
                                <span>Save Category</span>
                            </button>
                        </div>
                        <div class="col-md-10 col-md-offset-1">
                            <br />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    }
}

export default reduxForm({
        form: 'categoryform',
        fields: [
            '_id',
            'label',
            'toDelete',
            'delCat',
            'delSubcat',
            'owner',
            'ownerId',
            'subcats[]._id',
            'subcats[].label',
            'subcats[].toDelete',
            'subcats[].delCat',
            'subcats[].delSubcat'
        ],
        onSubmit: (data, dispatch) => {
            return new Promise(function (resolve, reject) {
                dispatch(categoryFormSubmit.action({data, reject, resolve}))
            })
        }
    },
    state => ((state.router.privateprops.categoryToEdit)
        ? {initialValues: state.router.privateprops.categoryToEdit}
        : {}))
(CategoryForm)
