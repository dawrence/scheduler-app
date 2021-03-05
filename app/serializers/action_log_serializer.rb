class ActionLogSerializer < ActiveModel::Serializer
  attributes :id, :student_info, :user_info, :action, :content

  belongs_to :user
  belongs_to :student

end
