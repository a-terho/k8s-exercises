import type { Metadata } from 'next';
import HeroImage from '@/app/components/HeroImage';
import TodoForm from '@/app/components/TodoForm';
import TodoList from '@/app/components/TodoList';

export const metadata: Metadata = {
  title: 'Index',
};

const IndexPage = async () => {
  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto">
      <div>
        <HeroImage />
        <TodoForm />
      </div>
      <h2>Todos</h2>
      <TodoList />
    </div>
  );
};

export default IndexPage;
