import React, { Fragment } from 'react'
import loading from '../../../img/loading.gif'

export default () => (
    <Fragment>
        <img
            src={loading}
            alt="Loading..."
            style={{
                width: '200px',
                height: '200px',
                margin: 'auto',
                display: 'block'
            }}
        />
    </Fragment>
)
