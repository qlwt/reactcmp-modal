export const focus_query = (
    `a[href], area[href]`
    + `, button:not(:disabled)`
    + `, input:not(:disabled):not([type="hidden"])`
    + `, select:not(:disabled), textarea:not(:disabled)`
    + `, iframe, object, embed`
    + `, audio[controls], video[controls]`
    + `, [contenteditable]:not([contenteditable="false"]), [tabIndex]:not([tabIndex^="-"]):not(:disabled)`
)
