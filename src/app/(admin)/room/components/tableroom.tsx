import ComponentContainerCard from "@/components/ComponentContainerCard"
import IconifyIcon from "@/components/wrappers/IconifyIcon"
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "react-bootstrap"


 
const BorderedTable = (borderTableData: []) => {
  
    return (
      <ComponentContainerCard title="Bordered Table">
        <div className="table-responsive">
          <table className="table table-bordered mb-0 table-centered">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Price</th>
                <th>Order Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {borderTableData.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td>#{item.id}</td>
                  <td>{item.date}</td>
                  <td>
                  
                    {item.price}
                  </td>
                  <td>
                    <span className={`badge bg-${item.status === 'Rejected' ? 'danger' : 'success'}`}>{item.status}</span>
                  </td>
                  <td className="text-end">
                    <Dropdown className="d-inline-block">
                      <DropdownToggle as="a" className="arrow-none" id="dLabel11" role="button">
                        <IconifyIcon icon="la:ellipsis-v" className="fs-20 text-muted" />
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-end" aria-labelledby="dLabel11">
                        <DropdownItem href="#">Creat Project</DropdownItem>
                        <DropdownItem href="#">Open Project</DropdownItem>
                        <DropdownItem href="#">Tasks Details</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentContainerCard>
    )
  }
  export default BorderedTable