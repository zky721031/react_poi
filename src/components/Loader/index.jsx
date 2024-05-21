import './loader.scss';
export default function Loader() {
  return (
    <div className='loader_container'>
      <div className='lds-ellipsis'>
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}
