import Card from '../common/Card'
import Button from '../common/Button'
import Badge from '../common/Badge'

const severityToBadge = {
  critical: 'error',
  warning: 'warning',
  info: 'info',
}

const RecommendationList = ({ items = [], onAction }) => {
  if (!items.length) {
    return (
      <Card>
        <p className="text-sm text-gray-600 dark:text-gray-300">Aucune recommandation pour le moment.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((rec) => (
        <Card key={rec.id}>
          <div className="flex items-start justify-between">
            <div className="pr-4">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{rec.title}</h3>
                {rec.severity && (
                  <Badge variant={severityToBadge[rec.severity] || 'info'} size="sm">
                    {rec.severity}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{rec.details}</p>
            </div>
            {rec.actions && rec.actions.length > 0 && (
              <div className="flex flex-col gap-2 w-52">
                {rec.actions.map((a, idx) => (
                  <Button
                    key={`${rec.id}-${idx}`}
                    variant={a.type === 'toggle' ? 'outline' : a.type === 'away' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => onAction && onAction(a)}
                  >
                    {a.label || 'Appliquer'}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}

export default RecommendationList
