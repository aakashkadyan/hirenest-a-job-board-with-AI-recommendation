import { useState } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';



const  UserProfile = ()=> {
  const userName = localStorage.getItem('userName');  
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/login');
  };


  return (
    <div className="relative inline-block text-left ml-200">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setOpen(!open)}>
    
        <img
          src="/images/avatar.png" // Replace with actual avatar
          alt="User Avatar"
          className="w-8 h-8 rounded-full"
        />
        <ChevronDown size={18} />
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-lg z-50">
          <div className="flex items-center gap-3 px-4 py-3 border-b">
            <img
              src="/images/avatar.png"
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase()}</span>
                          </div>
          </div>

          <div className="px-4 py-2 text-sm text-gray-700 space-y-2">
            <p className="text-gray-500 text-xs mt-2">Personal</p>
            {userRole !== 'employer' && (
              <DropdownItem label="Edit profile" onClick={() => navigate('/jobseekerform')} />
            )}

            {userRole !== 'jobseeker' && (
              <DropdownItem label="Edit profile" onClick={() => navigate('/employerprofileform')} />
            )}

            
            <DropdownItem label="Settings" />
            <DropdownItem label="Notifications" />
            <p className="text-gray-500 text-xs mt-4">Support</p>
            <DropdownItem label="Help" />
            <DropdownItem onClick ={handleLogout} label="Log out" icon={<LogOut size={16} />} />
          </div>

          <div className="p-3">

          </div>
        </div>
      )}
    </div>
  );
}

function DropdownItem({ label, icon, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-2 text-left px-2 py-1 hover:bg-gray-100 rounded-md">
      {icon && icon}
      {label}
    </button>
  );
}

export default UserProfile;