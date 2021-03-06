class ActionLogSerializer < ActiveModel::Serializer
  attributes :id, :student_info, :user_info, :action, :content,
             :logged_at, :user_text, :student_text

  belongs_to :user
  belongs_to :student

  def action
    object.action.downcase
  end

  def user_text
    object.user_text.strip
  end

  def student_text
    object.student_text.strip
  end

end
