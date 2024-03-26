import {useEffect} from 'react'
import {Link, Outlet} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../_metronic/helpers'

const AuthLayout = () => {
  useEffect(() => {
    const root = document.getElementById('root')
    if (root) {
      root.style.height = '100%'
    }
    return () => {
      if (root) {
        root.style.height = 'auto'
      }
    }
  }, [])

  return (
    <div className="d-flex flex-column flex-lg-row flex-column-fluid h-100">
      {/* begin::Body */}
      <div className="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1">
        {/* begin::Form */}
        <div className="d-flex flex-center flex-column flex-lg-row-fluid">
          {/* begin::Wrapper */}
          <div className="w-lg-500px w-md-500px w-sm-500px p-10">
            <Outlet />
          </div>
          {/* end::Wrapper */}
        </div>
        {/* end::Form */}

      </div>
      {/* end::Body */}

      {/* begin::Aside */}
      <div
        className="d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2"
        style={{backgroundImage: `url(${toAbsoluteUrl('/media/misc/auth-bg.png')})`}}
      >
        {/* begin::Content */}
        <div className="d-flex flex-column flex-center py-15 px-5 px-md-15 w-100">
          <h1 className="text-white fs-2qx fw-bolder text-center mb-7">
            PROJECT FINANCE SOFTWARE
          </h1>
          {/* end::Logo */}

          {/* begin::Image */}
          <img
            style={{borderRadius:"4px", boxShadow:"0 0 10px 0 rgba(0,0,0,0.1)"}}
            className="mx-auto w-275px w-md-50 w-sm-50 w-xl-500px w-xxl-700px mb-10 mb-lg-20"
            src={toAbsoluteUrl('/media/logos/ProjectFinance.jpeg')}
            alt=""
          />
           {/* end::Image */}
        </div>
        {/* end::Content */}
      </div>
      {/* end::Aside */}
    </div>
  )
}

export {AuthLayout}