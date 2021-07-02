import Swal from 'sweetalert2'

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

export const toastError = (message) => {
    return Toast.fire({
        text: message,
        icon: 'error'
    })
}

export const toastSuccess = (message) => {
    return Toast.fire({
        text: message,
        icon: 'success'
    })
}

const Ask = Swal.mixin({
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si',
    cancelButtonText: 'No'
})

export const AskYesNo = (title, text) => {
    return Ask.fire({
        title,
        text
    })
}