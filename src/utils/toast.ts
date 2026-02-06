export type ToastType = 'success' | 'error' | 'info';

export default function showToast(message: string, type: ToastType = 'info', duration = 4000) {
    try {
        const containerId = 'global-toast-container';
        let container = document.getElementById(containerId);
        if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            container.className = 'fixed bottom-4 right-4 sm:right-8 z-50 flex flex-col items-end gap-2 pointer-events-none';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        const base = 'max-w-xs w-full px-4 py-2 rounded-lg shadow-md text-sm flex items-center gap-3 pointer-events-auto';
        const color = type === 'success'
            ? 'bg-green-50 text-green-800'
            : type === 'error'
                ? 'bg-red-50 text-red-800'
                : 'bg-blue-50 text-blue-800';

        toast.className = `${base} ${color} opacity-0 transform translate-y-2 transition-all duration-300`;
        toast.textContent = message;

        const btn = document.createElement('button');
        btn.className = 'ml-2 text-xs text-gray-500 hover:text-gray-700';
        btn.innerText = 'Fechar';
        btn.onclick = () => {
            toast.className = `${base} ${color} opacity-0 transform translate-y-2 transition-all duration-300`;
            setTimeout(() => {
                toast.remove();
                if (container && container.childElementCount === 0) container.remove();
            }, 300);
        };

        container.appendChild(toast);
        toast.appendChild(btn);

        requestAnimationFrame(() => {
            toast.className = `${base} ${color} opacity-100 transform translate-y-0 transition-all duration-300`;
        });

        setTimeout(() => {
            toast.className = `${base} ${color} opacity-0 transform translate-y-2 transition-all duration-300`;
            setTimeout(() => {
                toast.remove();
                if (container && container.childElementCount === 0) container.remove();
            }, 300);
        }, duration);
    } catch (e) {
        alert(message);
    }
}
