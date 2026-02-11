import { useEffect } from 'react'
import { Tooltip } from 'bootstrap'

export function useBootstrapTooltips(deps: unknown[] = [], selector = '[data-bs-toggle="tooltip"]') {
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(selector)
    const tooltips = Array.from(tooltipTriggerList).map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl))

    return () => {
      tooltips.forEach((tooltip) => tooltip.dispose())
    }
  }, deps)
}
