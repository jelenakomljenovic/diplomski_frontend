export const tableStyles = {
    maxHeight: "65vh",
    minHeight: "65vh",
    width: "100%",
    backgroundColor: "white",
    '& .MuiDataGrid-columnHeaders': {
        backgroundColor: "#315783",
        color: "white",
        lineHeight: "40px",
        '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: "bold",
        },
        '& .MuiSvgIcon-root': {
            color: 'white',
        },
    },
    '& .MuiDataGrid-cellContent': {
        fontSize: '0.935rem',
        lineHeight: 1.57,
    },
    '& .MuiDataGrid-cell:focus-within': {
        outline: 'none',
    },
}


export const removeAdminStyle = {
    ...tableStyles,
}