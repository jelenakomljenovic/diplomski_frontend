export const tableStyles = {
    maxHeight: "64.1vh",
    minHeight: "61vh",
    width: "92.5%",
    marginLeft: "5%",
    backgroundColor: "white",
    '& .MuiDataGrid-columnHeaders': {
        backgroundColor: "#204066",
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