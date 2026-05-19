import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getTasks, deleteTask, updateTask } from '../api';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const projectFilter = searchParams.get('project');

  useEffect(() => {
    fetchTasks();
  }, [projectFilter]);

  const fetchTasks = async () => {
    try {
      const res = await getTasks(projectFilter);
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(id);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  // allow members to update their task status
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      setTasks(tasks.map((t) =>
        t._id === taskId ? { ...t, status: newStatus } : t
      ));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const isOverdue = (task) => {
    return task.status !== 'Completed' && new Date(task.dueDate) < new Date();
  };

  if (loading) return <p className="text-gray-500">Loading tasks...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
        {user?.role === 'admin' && (
          <Link
            to="/tasks/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm"
          >
            + New Task
          </Link>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-gray-600 font-medium">Title</th>
                <th className="text-left px-5 py-3 text-gray-600 font-medium">Project</th>
                <th className="text-left px-5 py-3 text-gray-600 font-medium">Assigned To</th>
                <th className="text-left px-5 py-3 text-gray-600 font-medium">Due Date</th>
                <th className="text-left px-5 py-3 text-gray-600 font-medium">Status</th>
                <th className="text-left px-5 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    No tasks found
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task._id} className={`hover:bg-gray-50 ${isOverdue(task) ? 'bg-red-50' : ''}`}>
                    <td className="px-5 py-3 text-gray-800 font-medium">{task.title}</td>
                    <td className="px-5 py-3 text-gray-600">{task.project?.title}</td>
                    <td className="px-5 py-3 text-gray-600">{task.assignedTo?.name}</td>
                    <td className="px-5 py-3 text-gray-600">
                      <span className={isOverdue(task) ? 'text-red-600 font-medium' : ''}>
                        {new Date(task.dueDate).toLocaleDateString()}
                        {isOverdue(task) && ' (Overdue)'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {/* Members can change status via dropdown */}
                      {user?.role === 'member' && task.assignedTo?._id === user._id ? (
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      ) : (
                        getStatusBadge(task.status)
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {user?.role === 'admin' && (
                        <div className="flex gap-2">
                          <Link
                            to={`/tasks/edit/${task._id}`}
                            className="text-indigo-600 hover:underline text-xs"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="text-red-500 hover:underline text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
