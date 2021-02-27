class ApiErrors::Unauthorized < StandardError
  def initialize(msg="Unauthorized")
    super
  end
end