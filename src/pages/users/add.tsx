import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { UserForm } from "../../components/users/user-form";

export function UserAddPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    // Here you would make an API call to create the user
    console.log("Creating user:", data);
    navigate("/dashboard/users");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Add New User
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm
            onSubmit={handleSubmit}
            onCancel={() => navigate("/dashboard/users")}
          />
        </CardContent>
      </Card>
    </div>
  );
}