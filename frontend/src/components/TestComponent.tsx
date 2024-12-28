import { GET_POSTS } from "@/api/graphql/Query";
import { useQuery } from "@apollo/client";

const TestComponent:React.FC = () =>{
    const {data,loading,error} = useQuery(GET_POSTS,{variables:{limit:10,skip:0}});
    if(data){
        console.log(data);        
    }
    return <div>Test</div>
}

export default TestComponent