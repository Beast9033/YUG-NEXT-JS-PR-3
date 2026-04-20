'use client'
import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.css'

const page = () => {
  const [user, setUser] = useState({})
  const [list, setList] = useState([])
  const [filteredList, setFilteredList] = useState([])
  const [editId, setEditId] = useState(null)
  const [hobby, setHobby] = useState([])
  const [error, setError] = useState({})
  const [page, setPage] = useState(1)
  const [limit, setlimit] = useState(5)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [searchTerm, setSearchTerm] = useState('')

  const firstindex = (page - 1) * limit
  const lastindex = page * limit
  const totalPage = Math.ceil(filteredList.length / limit)

  const sortedAndFilteredList = React.useMemo(() => {
    let result = [...list]

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        val => val.name && val.name.toLowerCase().includes(term)
      )
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let valA = a[sortConfig.key] || ''
        let valB = b[sortConfig.key] || ''

        if (typeof valA === 'string') valA = valA.toLowerCase()
        if (typeof valB === 'string') valB = valB.toLowerCase()

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [list, searchTerm, sortConfig])

  const data = sortedAndFilteredList.slice(firstindex, lastindex)

  const handleChange = event => {
    let { name, value, checked } = event.target
    if (name == 'hobby') {
      let newHobby = [...hobby]
      if (checked) {
        newHobby.push(value)
      } else {
        newHobby = newHobby.filter(val => val != value)
      }
      value = newHobby
      setHobby(newHobby)
    }
    setUser({ ...user, [name]: value })
  }

  const handleSubmit = event => {
    event.preventDefault()
    if (!validation()) return
    const userWithHobby = { ...user, hobby }
    if (editId == null) {
      const newList = [...list, { ...userWithHobby, id: Date.now() }]
      localStorage.setItem('users', JSON.stringify(newList))
      setList(newList)
    } else {
      const newList = list.map(value => {
        if (value.id == editId) return { ...userWithHobby, id: editId }
        return value
      })
      localStorage.setItem('users', JSON.stringify(newList))
      setList(newList)
      setEditId(null)
    }
    setUser({})
    setHobby([])
  }

  const handleDelete = id => {
    const newList = list.filter(val => val.id != id)
    localStorage.setItem('users', JSON.stringify(newList))
    setList(newList)
  }

  const handleEdit = id => {
    const data = list.find(val => val.id == id)
    setUser(data)
    setEditId(data.id)
    setHobby(data.hobby)
  }

  useEffect(() => {
    const oldData = JSON.parse(localStorage.getItem('users')) || []
    setList(oldData)
    setFilteredList(oldData)
  }, [])

  useEffect(() => {
    setFilteredList(list)
  }, [list])

  const validation = () => {
    let error = {}
    if (!user.name || user.name.length == 0) error.name = 'Please Enter Name'
    if (!user.email || user.email.length == 0)
      error.email = 'Please Enter Email'
    if (!user.password || user.password.length == 0) {
      error.password = 'Please Enter Password'
    } else if (user.password.length < 8) {
      error.password = 'Password must be at least 8 characters long'
    }
    if (!user.phone || user.phone.length == 0)
      error.phone = 'Please Enter Phone'
    if (!user.gender) error.gender = 'Please Select Gender'
    if (!user.address) error.address = 'Please Enter Address'
    setError(error)
    return Object.keys(error).length == 0
  }

  const handleSearch = event => {
    event.preventDefault()
    const term = event.target[0].value.trim()
    setSearchTerm(term)
    setPage(1)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setPage(1)
  }

  const handleSort = key => {
    if (sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
      })
    } else {
      setSortConfig({ key, direction: 'asc' })
    }
    setPage(1)
  }

  return (
    <div className='container'>
      <nav className='navbar navbar-expand-lg navbar-dark'>
        <div className='container'>
          <a className='navbar-brand fw-bold' href='#'>
            React<span className='text-warning'>Data</span>Center
          </a>
          <div className='d-flex ms-auto gap-2'>
            <form className='d-flex' role='search' onSubmit={handleSearch}>
              <input
                className='form-control me-2'
                type='search'
                placeholder='Search by Name'
                defaultValue={searchTerm}
              />
              <button className='btn btn-light' type='submit'>
                Search
              </button>
            </form>
            {searchTerm && (
              <button
                className='btn btn-outline-secondary'
                onClick={clearSearch}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className='row justify-content-center mt-5'>
        <div className='col-lg-4'>
          <div className='card'>
            <div className='card-header text-center'>
              <h4 className='fw-bold mb-0'>
                {editId ? 'Update User' : 'Add New User'}
              </h4>
            </div>
            <div className='card-body'>
              <form method='post' onSubmit={handleSubmit}>
                <div className='mb-3'>
                  <label htmlFor='name' className='form-label fw-bold'>
                    Name
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    value={user.name || ''}
                    onChange={handleChange}
                    name='name'
                    id='name'
                  />
                  {error.name && (
                    <span className='invalid-feedback d-block'>
                      {error.name}
                    </span>
                  )}
                </div>

                <div className='mb-3'>
                  <label htmlFor='email' className='form-label fw-bold'>
                    Email
                  </label>
                  <input
                    type='email'
                    className='form-control'
                    value={user.email || ''}
                    onChange={handleChange}
                    name='email'
                    id='email'
                  />
                  {error.email && (
                    <span className='invalid-feedback d-block'>
                      {error.email}
                    </span>
                  )}
                </div>

                <div className='mb-3'>
                  <label htmlFor='password' className='form-label fw-bold'>
                    Password
                  </label>
                  <input
                    type='password'
                    className='form-control'
                    value={user.password || ''}
                    onChange={handleChange}
                    name='password'
                    id='password'
                  />
                  {error.password && (
                    <span className='invalid-feedback d-block'>
                      {error.password}
                    </span>
                  )}
                </div>

                <div className='mb-3'>
                  <label htmlFor='phone' className='form-label fw-bold'>
                    Phone
                  </label>
                  <input
                    type='tel'
                    className='form-control'
                    value={user.phone || ''}
                    onChange={handleChange}
                    name='phone'
                    id='phone'
                  />
                  {error.phone && (
                    <span className='invalid-feedback d-block'>
                      {error.phone}
                    </span>
                  )}
                </div>

                <div className='mb-3'>
                  <label className='form-label fw-bold'>Gender</label>
                  {error.gender && (
                    <span className='invalid-feedback d-block'>
                      {error.gender}
                    </span>
                  )}
                  <div className='d-flex gap-4'>
                    <div className='form-check'>
                      <input
                        className='form-check-input'
                        type='radio'
                        name='gender'
                        id='male'
                        value='male'
                        onChange={handleChange}
                        checked={user.gender === 'male'}
                      />
                      <label className='form-check-label' htmlFor='male'>
                        Male
                      </label>
                    </div>
                    <div className='form-check'>
                      <input
                        className='form-check-input'
                        type='radio'
                        name='gender'
                        id='female'
                        value='female'
                        onChange={handleChange}
                        checked={user.gender === 'female'}
                      />
                      <label className='form-check-label' htmlFor='female'>
                        Female
                      </label>
                    </div>
                  </div>
                </div>

                <div className='mb-3'>
                  <label className='form-label fw-bold'>Hobby</label>
                  <div className='d-flex flex-wrap gap-3'>
                    <div className='form-check'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        value='programming'
                        name='hobby'
                        onChange={handleChange}
                        checked={hobby.includes('programming')}
                      />
                      <label className='form-check-label'>Programming</label>
                    </div>
                    <div className='form-check'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        value='hacking'
                        name='hobby'
                        onChange={handleChange}
                        checked={hobby.includes('hacking')}
                      />
                      <label className='form-check-label'>Hacking</label>
                    </div>
                    <div className='form-check'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        value='boxing'
                        name='hobby'
                        onChange={handleChange}
                        checked={hobby.includes('boxing')}
                      />
                      <label className='form-check-label'>Boxing</label>
                    </div>
                    <div className='form-check'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        value='social-politics'
                        name='hobby'
                        onChange={handleChange}
                        checked={hobby.includes('social-politics')}
                      />
                      <label className='form-check-label'>
                        Social Politics
                      </label>
                    </div>
                    <div className='form-check'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        value='space-research'
                        name='hobby'
                        onChange={handleChange}
                        checked={hobby.includes('space-research')}
                      />
                      <label className='form-check-label'>Space Research</label>
                    </div>
                  </div>
                </div>

                <div className='mb-3'>
                  <label className='form-label fw-bold'>Address</label>
                  {error.address && (
                    <span className='invalid-feedback d-block'>
                      {error.address}
                    </span>
                  )}
                  <textarea
                    className='form-control'
                    rows='3'
                    name='address'
                    value={user.address || ''}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className='mb-3'>
                  <label className='form-label fw-bold'>City</label>
                  <select
                    className='form-select'
                    name='city'
                    onChange={handleChange}
                    value={user.city || ''}
                  >
                    <option value=''>Select City</option>
                    <option value='navsari'>Navsari</option>
                    <option value='surat'>Surat</option>
                    <option value='california'>California</option>
                    <option value='nevada'>Nevada</option>
                    <option value='sydney'>Sydney</option>
                  </select>
                </div>

                <button
                  type='submit'
                  className='btn btn-primary w-100 py-2 fw-bold'
                >
                  {editId ? 'Update User' : 'Submit User'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className='col-lg-8 mt-4 mt-lg-0'>
          <div className='card'>
            <div className='card-header d-flex justify-content-between align-items-center flex-wrap gap-2'>
              <h4 className='mb-0 fw-bold'>User Records</h4>
              <span className='badge bg-primary fs-6'>
                {sortedAndFilteredList.length} Users
              </span>
            </div>

            <div className='px-3 pt-3'>
              <div className='sort-buttons'>
                <button
                  className={`btn btn-outline-primary sort-btn ${
                    sortConfig.key === 'name' ? 'active' : ''
                  }`}
                  onClick={() => handleSort('name')}
                >
                  Sort by Name{' '}
                  {sortConfig.key === 'name' &&
                    (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  className={`btn btn-outline-primary sort-btn ${
                    sortConfig.key === 'email' ? 'active' : ''
                  }`}
                  onClick={() => handleSort('email')}
                >
                  Sort by Email{' '}
                  {sortConfig.key === 'email' &&
                    (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </button>
              </div>
            </div>

            <div className='table-responsive'>
              <table className='table table-hover table-striped mb-0'>
                <thead>
                  <tr>
                    <th>Sr No.</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Hobby</th>
                    <th>City</th>
                    <th className='text-center'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAndFilteredList.length > 0 ? (
                    data.map((value, index) => (
                      <tr key={value.id}>
                        <td>{firstindex + index + 1}</td>
                        <td>{value.name}</td>
                        <td>{value.email}</td>
                        <td>{value.phone}</td>
                        <td>
                          <span
                            className={`badge ${
                              value.gender === 'male'
                                ? 'bg-primary'
                                : 'bg-danger'
                            }`}
                          >
                            {value.gender}
                          </span>
                        </td>
                        <td>
                          {Array.isArray(value.hobby)
                            ? value.hobby.join(', ')
                            : value.hobby}
                        </td>
                        <td>{value.city}</td>
                        <td className='text-center'>
                          <button
                            type='button'
                            className='btn btn-outline-warning btn-sm me-2'
                            onClick={() => handleEdit(value.id)}
                          >
                            Edit
                          </button>
                          <button
                            type='button'
                            className='btn btn-outline-danger btn-sm'
                            onClick={() => handleDelete(value.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className='text-center py-5 fw-bold text-muted'
                      >
                        {searchTerm
                          ? 'No matching records found'
                          : 'Data Not Found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPage > 1 && (
              <div className='card-footer bg-white border-0 pt-3'>
                <nav>
                  <ul className='pagination justify-content-center'>
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                      <button
                        className='page-link'
                        onClick={() => setPage(page > 1 ? page - 1 : page)}
                      >
                        Previous
                      </button>
                    </li>
                    {[...Array(totalPage)].map((_, index) => (
                      <li
                        key={index}
                        className={`page-item ${
                          page === index + 1 ? 'active' : ''
                        }`}
                      >
                        <button
                          className='page-link'
                          onClick={() => setPage(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        page === totalPage ? 'disabled' : ''
                      }`}
                    >
                      <button
                        className='page-link'
                        onClick={() =>
                          setPage(page < totalPage ? page + 1 : page)
                        }
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
