'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter
} from 'src/components/ui/dialog';
import '../styles/employee.css';
import { useState } from 'react';

const EmployeeManagementPage = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: 'John Doe', position: 'Developer', photo: '/path/to/photo' },
    { id: 2, name: 'Jane Smith', position: 'Designer', photo: '/path/to/photo' }
  ]);

  const [newEmployee, setNewEmployee] = useState<{
    name: string;
    position: string;
    photo: string | null;
  }>({
    name: '',
    position: '',
    photo: null
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<{
    id: number;
    name: string;
    position: string;
    photo: string | null;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isEditDialogOpen && selectedEmployee) {
      setSelectedEmployee((prev) => (prev ? { ...prev, [name]: value } : null));
    } else {
      setNewEmployee((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addEmployee = () => {
    setEmployees((prev) => [
      ...prev,
      { ...newEmployee, id: prev.length + 1, photo: newEmployee.photo || '' }
    ]);
    setNewEmployee({ name: '', position: '', photo: null });
    setIsDialogOpen(false);
  };

  const deleteEmployee = (id: number) => {
    setEmployees((prevEmployees) =>
      prevEmployees.filter((employee) => employee.id !== id)
    );
  };

  const editEmployee = (id: number) => {
    const employee = employees.find((emp) => emp.id === id);
    if (employee) {
      setSelectedEmployee(employee);
      setIsEditDialogOpen(true);
    }
  };

  const saveEditEmployee = () => {
    if (selectedEmployee) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === selectedEmployee.id
            ? { ...selectedEmployee, photo: selectedEmployee.photo || '' }
            : emp
        )
      );

      setIsEditDialogOpen(false);
      setSelectedEmployee(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (isEditDialogOpen && selectedEmployee) {
          setSelectedEmployee((prev) =>
            prev ? { ...prev, photo: reader.result as string } : null
          );
        } else {
          setNewEmployee((prev) => ({
            ...prev,
            photo: reader.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="banner">
        <h1 className="app-title">EMPLOYEE MANAGEMENT</h1>
        <p className="app-subtitle">
          Manage your team effortlessly. Add, edit, and organize your employees
          with just a few clicks.
        </p>
      </div>
      {/* Dialog pour ajouter un employé */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => setIsDialogOpen(open)}
      >
        <DialogTrigger asChild>
          <Button className="dialog-add-employee-btn">Add Employee</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Add New Employee</DialogTitle>
          <form>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newEmployee?.name || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="position">Position:</label>
              <input
                type="text"
                id="position"
                name="position"
                value={newEmployee?.position || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="photo">Photo:</label>
              <div
                className="photo-upload"
                onClick={() => document.getElementById('photo-input')?.click()}
              >
                <div className="photo-upload-icon">📷</div>
                <p>Click or drag to upload a photo</p>
                <input
                  type="file"
                  id="photo-input"
                  name="photo"
                  aria-label="Upload photo"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          </form>
          <DialogFooter>
            <Button onClick={addEmployee} type="button">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour modifier un employé */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => setIsEditDialogOpen(open)}
      >
        <DialogContent>
          <DialogTitle>Edit Employee</DialogTitle>
          {selectedEmployee && (
            <form>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={selectedEmployee.name || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="position">Position:</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={selectedEmployee.position || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="photo">Photo:</label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  aria-label="Upload photo"
                  onChange={handleFileUpload}
                />
              </div>
            </form>
          )}
          <DialogFooter>
            <Button onClick={saveEditEmployee} type="button">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="employee-cards-container">
        {employees.map((employee) => (
          <Card key={employee.id} className="employee-card">
            <CardContent>
              <img
                src={employee.photo}
                alt={employee.name}
                className="employee-photo"
              />
              <h3>{employee.name}</h3>
              <p>{employee.position}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => editEmployee(employee.id)}>
                <Edit className="h-5 w-5" />
              </Button>
              <Button onClick={() => deleteEmployee(employee.id)}>
                <Trash2 className="h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
};

export default EmployeeManagementPage;
