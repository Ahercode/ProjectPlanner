import { Button, Input, Modal, Space, Table, message } from 'antd'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { KTCardBody, KTSVG } from '../../../../_metronic/helpers'
import { deleteItem, fetchDocument, postItem, updateItem } from '../../../services/ApiCalls'

const ProjectActivity = () => {
  const [gridData, setGridData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { register, reset, handleSubmit } = useForm()
  const param: any = useParams();
  const navigate = useNavigate();
  const [tempData, setTempData] = useState<any>()
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const queryClient = useQueryClient()
  const [detailName, setDetailName] = useState('')
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    reset()
    setIsModalOpen(false)
    setIsUpdateModalOpen(false)
    setTempData(null)
  }

  const handleChange = (event: any) => {
    event.preventDefault()
    setTempData({ ...tempData, [event.target.name]: event.target.value });
  }

  const { mutate: deleteData, isLoading: deleteLoading } = useMutation(deleteItem, {
    onSuccess: (data) => {
      queryClient.setQueryData(['ProjectActivities', tempData], data);
      loadData()
    },
    onError: (error) => {
      console.log('delete error: ', error)
    }
  })

  const handleDelete = (element: any) => {
    const item = {
      url: 'ProjectActivities',
      data: element
    }
    deleteData(item)
  }

  const columns: any = [
   
    {
      title: 'Activity',
      key: 'activityId',
      render: (row: any) => {
        return getActivityname(row.activityId)
      },
      sorter: (a: any, b: any) => {
        if (a.activityId > b.activityId) {
          return 1
        }
        if (b.activityId > a.activityId) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Contractor',
      key: 'contractorId',
      render: (row: any) => {
        return getActivityname(row.contractorId)
      },
      sorter: (a: any, b: any) => {
        if (a.contractorId > b.contractorId) {
          return 1
        }
        if (b.contractorId > a.contractorId) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Action',
      fixed: 'right',
      width: 100,
      render: (_: any, record: any) => (
        <Space size='middle'>
          <Link to={`/project-activity-costs/${record.id}`}>
            <span className='btn btn-light-info btn-sm'>Details</span>
          </Link>
          <a onClick={() => showUpdateModal(record)} className='btn btn-light-warning btn-sm'>
            Update
          </a>
          <a onClick={() => handleDelete(record)} className='btn btn-light-danger btn-sm'>
            Delete
          </a>
        </Space>
      ),

    },
  ]

  const { data: Activities } = useQuery('activities', ()=> fetchDocument('Activities'), { cacheTime: 5000 })
  const { data: Projects } = useQuery('projects', ()=> fetchDocument('Projects'), { cacheTime: 5000 })
  
  const loadData = async () => {
    setLoading(true)
    try {
      const response = await fetchDocument('ProjectActivities')
      setGridData(response.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const getActivityname = (gradeId: any) => {
    let activityName = null
    Activities?.data.map((item: any) => {
      if (item.id === gradeId) {
        activityName=item.name
      }
    })
    return activityName
  }
  const getItemName = async (param: any) => {

    let newName = null

    const itemTest = await Projects?.data.find((item: any) =>
      item.id.toString() === param
    )
    newName = await itemTest
    return newName
  }

 
  useEffect(() => {
    (async () => {
        let res = await getItemName(param.id)
        setDetailName(res?.name)
    })();
    loadData()
  }, [])

  // const dataByID = gridData.filter((user: any) => {
  //   return user.id !== 42
  // })

  const dataByID = gridData.filter((user: any) => {
    return user.projectId === parseInt(param.id)
  })

  const handleInputChange = (e: any) => {
    setSearchText(e.target.value)
    if (e.target.value === '') {
      loadData()
    }
  }

  const globalSearch = () => {
    // @ts-ignore
    filteredData = dataWithIndex.filter((value) => {
      return (
        value.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        value.surname.toLowerCase().includes(searchText.toLowerCase()) ||
        value.gender.toLowerCase().includes(searchText.toLowerCase()) ||
        value.employeeId.toLowerCase().includes(searchText.toLowerCase())
      )
    })
    setGridData(filteredData)
  }


  const { isLoading: updateLoading, mutate: updateData } = useMutation(updateItem, {
    onSuccess: (data) => {
      queryClient.setQueryData(['ProjectActivities', tempData], data);
      reset()
      setTempData({})
      loadData()
      setIsUpdateModalOpen(false)
      setIsModalOpen(false)
    },
    onError: (error) => {
      console.log('update error: ', error)
    }
  })

  const handleUpdate = (e: any) => {
    e.preventDefault()
   
      const item = {
        url: 'ProjectActivities',
        data: tempData
      }
      updateData(item)
      console.log('update: ', item.data)
    // } else {
    //   setLoading(false)
    //   message.error('First Name must be more than 5 characters')
    // }
  }

  const showUpdateModal = (values: any) => {
    showModal()
    setIsUpdateModalOpen(true)
    setTempData(values);
  }

  const OnSubmit = handleSubmit(async (values) => {
    setLoading(true)
    const endpoint = 'ProjectActivities'
    // object item to be passed down to postItem function
      const item = {
        data: {
          projectId:parseInt(param.id),
          activityId: values.activityId,
        },
        url: endpoint
      }
      console.log(item.data)
      postData(item)
  })

  const { mutate: postData, isLoading: postLoading } = useMutation(postItem, {
    onSuccess: (data) => {
      queryClient.setQueryData(['ProjectActivities', tempData], data);
      reset()
      setTempData({})
      loadData()
      setIsModalOpen(false)
    },
    onError: (error) => {
      console.log('post error: ', error)
    }
  })

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <KTCardBody className='py-4 '>
        <div className='table-responsive'>
        <div>
            <span className="fw-bold text-gray-800 d-block fs-2 mb-3 ">{detailName}</span>
            
            <br></br>
            <button className='mb-3 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary' onClick={() => navigate(-1)}>Go Back</button>
        </div>
          <div className='d-flex justify-content-between'>
            <Space style={{ marginBottom: 16 }}>
              <Input
                placeholder='Enter Search Text'
                onChange={handleInputChange}
                type='text'
                allowClear
                value={searchText}
              />
              <Button type='primary' onClick={globalSearch}>
                Search
              </Button>
            </Space>
            <Space style={{ marginBottom: 16 }}>
              <button type='button' className='btn btn-primary me-3' onClick={showModal}>
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                Add
              </button>
            </Space>
          </div>
          <Table columns={columns} dataSource={dataByID}loading={loading} />
          <Modal
            title={isUpdateModalOpen ? 'Update Project Activity' : 'Add Project Activity'}
            open={isModalOpen}
            onCancel={handleCancel}
            closable={true}
            footer={[
              <Button key='back' onClick={handleCancel}>
                Cancel
              </Button>,
              <Button
                key='submit'
                type='primary'
                htmlType='submit'
                loading={submitLoading}
                onClick={isUpdateModalOpen ? handleUpdate : OnSubmit}
              >
                Submit
              </Button>,
            ]}
          >
            <form
              onSubmit={isUpdateModalOpen ? handleUpdate : OnSubmit}
            >
              <hr></hr>
              <div style={{ padding: "20px 20px 20px 20px" }} className='row mb-0 '>
                
                <div className=' mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Activity</label>
                  <select 
                    {...register("activityId")} 
                    value={isUpdateModalOpen === true ? tempData?.activityId?.toString() : null}
                    onChange={handleChange}
                    className="form-select form-select-solid" aria-label="Select example">
                    {isUpdateModalOpen === false ? <option>Select Activity</option> : null}
                    {Activities?.data.map((item: any) => (
                        <option value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div className=' mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Contractor</label>
                  <select

                    // onChange={handleChange}
                    className="form-select form-select-solid" aria-label="Select example">
                    {/*{isUpdateModalOpen === false ? <option>Select Activity</option> : null}*/}
                    {/*{Activities?.data.map((item: any) => (*/}
                    {/*    <option value={item.id}>{item.name}</option>*/}
                    {/*))}*/}
                    <option>Select Contractor</option>
                  </select>
                </div>
                
              </div>
            </form>
          </Modal>
        </div>
      </KTCardBody>
    </div>
  )
}

export { ProjectActivity }

