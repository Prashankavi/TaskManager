import { format, isAfter, isBefore, isToday, isTomorrow } from 'date-fns'
import { Calendar, Flag, Tag } from 'lucide-react'

function TaskCard({ task, onClick, isDragging }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#991b1b'
      case 'high': return '#dc2626'
      case 'medium': return '#92400e'
      case 'low': return '#065f46'
      default: return '#475569'
    }
  }

  const getPriorityBgColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#ffc2c7'
      case 'high': return '#ffa8b0'
      case 'medium': return '#fbe5c8'
      case 'low': return '#b6e5d8'
      default: return '#f8fafc'
    }
  }

  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return null
    
    try {
      const date = new Date(dueDate)
      if (isToday(date)) return { text: 'Today', color: '#dc2626', bgColor: '#fef2f2' }
      if (isTomorrow(date)) return { text: 'Tomorrow', color: '#a16207', bgColor: '#fefce8' }
      if (isBefore(date, new Date())) return { text: 'Overdue', color: '#dc2626', bgColor: '#fef2f2' }
      if (isAfter(date, new Date())) return { text: format(date, 'MMM d'), color: '#64748b', bgColor: '#f8fafc' }
    } catch (error) {
      console.error('Error parsing due date:', error)
    }
    return null
  }

  const dueDateStatus = getDueDateStatus(task.dueDate)

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isDragging ? 0.5 : 1,
        boxShadow: isDragging ? '0 8px 16px -4px rgba(0, 0, 0, 0.15)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transform: isDragging ? 'rotate(5deg)' : 'none',
        animation: 'slideUp 0.4s ease-out',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        if (!isDragging) {
          e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.15)'
          e.currentTarget.style.borderColor = '#8fdde7'
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
          // Show hover overlay
          const overlay = e.currentTarget.querySelector('[data-hover-overlay]')
          if (overlay) overlay.style.opacity = '1'
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          e.currentTarget.style.borderColor = '#e2e8f0'
          e.currentTarget.style.transform = 'translateY(0) scale(1)'
          // Hide hover overlay
          const overlay = e.currentTarget.querySelector('[data-hover-overlay]')
          if (overlay) overlay.style.opacity = '0'
        }
      }}
    >
      {/* Hover Effect Overlay */}
      <div 
        data-hover-overlay
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(143, 221, 231, 0.05) 0%, rgba(182, 229, 216, 0.05) 100%)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none'
        }} 
      />
      {/* Priority Badge */}
      {task.priority && task.priority !== 'medium' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginBottom: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 6px',
            backgroundColor: getPriorityBgColor(task.priority),
            color: getPriorityColor(task.priority),
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '500',
            border: `1px solid ${getPriorityColor(task.priority)}20`
          }}>
            <Flag size={10} />
            <span style={{ textTransform: 'capitalize' }}>{task.priority}</span>
          </div>
        </div>
      )}

      {/* Task Title */}
      <h4 style={{
        fontSize: '14px',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '8px',
        lineHeight: '1.4'
      }}>
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p style={{
          fontSize: '12px',
          color: '#64748b',
          marginBottom: '8px',
          lineHeight: '1.4',
          maxHeight: '2.8em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {task.description}
        </p>
      )}

      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', flexWrap: 'wrap' }}>
          {task.labels.slice(0, 3).map((label, index) => (
            <span
              key={index}
              style={{
                fontSize: '10px',
                padding: '2px 6px',
                backgroundColor: '#f1f5f9',
                color: '#475569',
                borderRadius: '4px',
                border: '1px solid #e2e8f0',
                fontWeight: '500'
              }}
            >
              {label}
            </span>
          ))}
          {task.labels.length > 3 && (
            <span style={{
              fontSize: '10px',
              color: '#64748b',
              fontWeight: '500'
            }}>
              +{task.labels.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '8px',
        marginTop: '8px'
      }}>
        {/* Due Date */}
        {dueDateStatus && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            color: dueDateStatus.color,
            backgroundColor: dueDateStatus.bgColor,
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: '500'
          }}>
            <Calendar size={12} />
            <span>{dueDateStatus.text}</span>
          </div>
        )}

        {/* Task Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '10px',
          color: '#64748b'
        }}>
          {task.description && (
            <span title="Has description">ðŸ“</span>
          )}
          {task.labels && task.labels.length > 0 && (
            <span title={`${task.labels.length} labels`}>ðŸ·ï¸ {task.labels.length}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskCard