import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, deleteProject } from '../api';
import { useAuth } from '../context/AuthContext';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  if (loading) return <p className="text-gray-500">Loading projects...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        {user?.role === 'admin' && (
          <Link
            to="/projects/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm"
          >
            + New Project
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No projects found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                {project.description || 'No description'}
              </p>
              <div className="text-xs text-gray-400 mb-3">
                <p>Created by: {project.createdBy?.name}</p>
                <p>Members: {project.teamMembers?.length || 0}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/tasks?project=${project._id}`}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  View Tasks
                </Link>
                {user?.role === 'admin' && (
                  <>
                    <Link
                      to={`/projects/edit/${project._id}`}
                      className="text-sm text-gray-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
