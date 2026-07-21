import { breakAppAction } from '@/app/actions/breakApp';

const BreakAppButton = () => {
  return (
    <form action={breakAppAction}>
      <button
        type="submit"
        className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded mt-5"
      >
        break the app
      </button>
    </form>
  );
};

export default BreakAppButton;
