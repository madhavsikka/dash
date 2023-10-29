import "./style.css"

function IndexPopup() {
  return (
    <div className="flex flex-col w-64 py-2 items-center rounded-lg bg-slate-950">
      <h1 className="text-2xl font-medium capitalize text-slate-700">Dash</h1>
      <button
        className="my-3 rounded-lg px-3 py-3 transition-colors bg-slate-900 focus:outline-none"
        onClick={() => {
          chrome.tabs.create({ url: "tabs/search.html" })
        }}>
        <h1 className="text-lg font-medium capitalize text-slate-700">
          Start Chatting
        </h1>
      </button>
    </div>
  )
}

export default IndexPopup
