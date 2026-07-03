import type { Metadata } from 'next';
import config from '@/app/util/config';
import HeroImage from '@/app/components/HeroImage';
import TodoForm from '@/app/components/TodoForm';
import TodoList from '@/app/components/TodoList';

// to allow config to load values during runtime
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Index',
};

const IndexPage = async () => {
  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto">
      <div>
        <HeroImage />
        <TodoForm maxLength={config.maxTodoLength} />
      </div>
      <h2>Todos</h2>
      <TodoList />
    </div>
  );
};

export default IndexPage;
